import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { uploadImage } = await import('../utils/claudinary.js');

export const registerUser = asyncHandler(async (req, res) => {
  //First we will take the data from the frontend

 const { fullname, password, email, userName } = req.body;

  // Validate fields

  if ([fullname, password, email, userName].some(field => !field || field.trim() === "")) {
  throw new ApiError(400, "All fields are required.");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ $or:[{userName}, {email}] });
  if (existingUser) {
    throw new ApiError(202, "Username already exists.").res(send);
  }

  //check for images and avater (all the compuslary fields)

  const avaterPath = req.files? ['avatar'][0] ?.path : null;
  const coverPhotoPath = req.files?['coverPhoto'][0] ?.path : null;
  if(!avaterPath){
    throw new ApiError(400, "Avatar is required");
  }

    

  //upload the image to the claudinary

  

  const avatarUrl = avaterPath ? await uploadImage(avaterPath) : null;
  const coverPhotoUrl = coverPhotoPath ? await uploadImage(coverPhotoPath) : null;

  //then we will create the user in the database

  const newUser = await User.create({
    userName,
    email,
    fullName: fullname, 
    password,
    avatar: avatarUrl,
    coverImage: coverPhotoUrl
  });


  //we will not send the password, __v, createdAt, updatedAt and refreshToken fields to the frontend

  const createdUser = await User.findOne({_id:newUser._id}).select("-password -__v -createdAt -updatedAt -refreshToken");

  if(!createdUser) {
    throw new ApiError(500, "User creation failed");
  }


  //then we will send the response to the frontend
  return new ApiResponse(201, "User registered successfully", createdUser).send(res);
  
}); 

const generateAccessTokenAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // Save the refresh token in the user document
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // Return both tokens
    return { accessToken, refreshToken };

  } catch (error) {
    console.log("Something went wrong while generating tokens", error);
    throw new ApiError(500, "Internal server error");
  }
};

export const loginUser = asyncHandler(async (_, res) => {
  const { email, password, userName } = res.body;
  if(!email && !userName) {
    throw new ApiError(400, "Email or Username is required");
  }

  if(!password) {
    throw new ApiError(400, "Password is required");
  }

  // Find user by email or username
  const user = await User.findOne({ $or: [{ email }, { userName }]
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }
  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user);

  // Send response with tokens and user data
  const userData = await User.findById(user._id).select("-password -__v -createdAt -updatedAt -refreshToken");

  const options = {
    httpOnly: true,
    secure: true, // Set secure flag in production
  }

  res.cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options);
  return new ApiResponse(200, "Login successful", {
    user: userData,
    accessToken,
    refreshToken
  }).send(res);  
});

export const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Clear the refresh token from the user document
  await User.findByIdAndUpdate(userId,
    { 
      $set: {
        refreshToken: null // Clear the refresh token
      }
    },
    { 
      new: true
    }
  );

  const options = {
    httpOnly: true,
    secure: true, // Set secure flag in production
  }

  // Clear cookies
  res.clearCookie("refreshToken", options);
  res.clearCookie("accessToken", options);

  return new ApiResponse(200, "Logout successful").send(res);
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies || req.body;
  if(!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }


  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(404, "User not found or refresh token mismatch");
  }
  // Find user by refresh token
  // const user = await User.findOne({ refreshToken });

  // if (!user) {
  //   throw new ApiError(404, "User not found");
  // }

  // Generate new access token
  const { accessToken, refreshToken: newRefreshToken } = await generateAccessTokenAndRefreshToken(user);
  const options = {
    httpOnly: true,
    secure: true, // Set secure flag in production
  }
  res.cookie("refreshToken", newRefreshToken, options)
    .cookie("accessToken", accessToken, options);

  // Send response with new tokens and user data
  return new ApiResponse(200, "Access token refreshed successfully", {
    accessToken,
    refreshToken: newRefreshToken}).send(res);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return new ApiResponse(200, "Password changed successfully").send(res);
});