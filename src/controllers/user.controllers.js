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