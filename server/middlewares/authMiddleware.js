import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;

 
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
    
      token = req.headers.authorization.split(' ')[1];

      
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      
      req.user = await userModel.findById(decoded._id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found, authorization failed' });
      }

      
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message); // Log the exact error
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
