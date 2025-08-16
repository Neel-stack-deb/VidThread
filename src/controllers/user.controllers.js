import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';

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
    await user.save();
    // Return both tokens
    return { accessToken, refreshToken };

  } catch (error) {
    console.log("Something went wrong while generating tokens", error);
    throw new ApiError(500, "Internal server error");
  }
};

export const loginUser = asyncHandler(async (req, res) => {
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