import { mongoose, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  }, 
  avatar: {
    type: String,
    required: true
  },
  coverImage: {
    type: String
  },  
  watchHistory: [{
    type: Schema.Types.ObjectId,
    ref: 'Video'
  }],
  refreshToken: {
    type: String,
  }
},{
  timestamps: true,
});

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password)
  
};

userSchema.pre('save',async function (next){
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


export const User = new model('User', userSchema);

