import { comparePassword, hashedPassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken';


export const registerController = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      if (!username || !email || !password ) {
        return res.status(400).send({
          success: false,
          message: "All fields are required."
        });
      }
  
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).send({
          success: false,
          message: "User already registered."
        });
      }
  
      const hashPassword = await hashedPassword(password);
      const user = new userModel({ username, email, password: hashPassword,});
      await user.save();
  
      res.status(200).send({
        success: true,
        message: "Registration successful",
        user: {
          username: user.username,
          email: user.email,
        }
      });
    } catch (error) {
      console.log(error)
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
        
      });
    }
  };


  export const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).send({
          success: false,
          message: "Email and password are required."
        });
      }
  
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).send({
          success: false,
          message: "User not registered."
        });
      }
  
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(400).send({
          success: false,
          message: "Incorrect password."
        });
      }
  
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: '1d' });
  
      res.status(200).send({
        success: true,
        message: 'Login successful',
        user: {
          username: user.username,
          email: user.email,
         
        },
        token
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: 'Something went wrong',
        error
      });
    }
  }


  export const searchUsers = async (req, res) => {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ success: false, message: "Query is required" });
    }
  
    try {
      const users = await userModel.find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      }).select("_id username email");
  
      res.status(200).json({ success: true, users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export const sendFriendRequest = async (req, res) => {
    const { friendId } = req.body;
  
    try {
      const user = await userModel.findById(req.user._id);
      const friend = await userModel.findById(friendId);
  
      if (!friend) {
        return res.status(404).send({ success: false, message: 'User not found' });
      }
  
     
      if (friend.friendRequests.some((id) => id.toString() === user._id.toString())) {
        return res.status(400).send({
          success: false,
          message: 'Request already sent',
        });
      }
  
     
      friend.friendRequests.push(user._id);
      await friend.save();
  
      res.status(200).send({
        success: true,
        message: 'Friend request sent',
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: 'Server error',
      });
    }
  };
  
  export const getFriendRequests = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const friendRequests = await userModel.find({
      '_id': { $in: user.friendRequests },
    }).select('_id username');

    res.status(200).json({
      success: true,
      requests: friendRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

  
  
  export const acceptFriendRequest = async (req, res) => {
    const { friendId } = req.body;
    try {
      const user = await userModel.findById(req.user._id);
      const friend = await userModel.findById(friendId);
  
      if (!friend) return res.status(404).json({ message: 'User not found' });
  
      user.friends.push(friendId);
      friend.friends.push(user._id);
  
      user.friendRequests = user.friendRequests.filter((_id) => _id.toString() !== friendId.toString());
      await user.save();
      await friend.save();
  
      res.status(200).send({
        success:true,
         message: 'Friend request accepted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };




  import User from "../models/userModel.js"; 


export const getAllFriends = async (req, res) => {
  try {
   
    const userId = req.user._id;

    
    const user = await userModel.findById(userId).populate("friends", "name email"); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    res.status(200).json({
      friends: user.friends,
      totalFriends: user.friends.length,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
