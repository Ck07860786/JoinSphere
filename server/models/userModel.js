import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: {
     type: String,
      required: true, 
      unique: true
     },
  email: { type: String,
     required: true,
      unique: true 
    },

  password: { 
    type: String, 
    required: true 
},
  friends: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User' 
    }],

  friendRequests: [{
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User' 
    }],
});

export default mongoose.model('User', userSchema)