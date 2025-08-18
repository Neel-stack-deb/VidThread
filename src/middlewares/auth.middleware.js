import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError.js";
dotenv.config();
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT =asyncHandler(async (req, _, next) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Access token is required");
  }
  
  
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
  const user = await User.findById(decoded.userId).select("-password -__v -createdAt -updatedAt -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  req.user = user;
  next();
});