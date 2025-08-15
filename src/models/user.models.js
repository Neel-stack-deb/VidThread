import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
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

userSchema.methods.generateAccessToken = function() {
  return jwt.sign({ userId: this._id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign({ userId: this._id }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
};

userSchema.pre('save',async function (next){
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


export const User = new model('User', userSchema);

