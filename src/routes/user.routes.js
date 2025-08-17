import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken, updateUserAvatar, updateUserCoverPhoto, updateUserProfile } from "../controllers/user.controllers.js";
import { uploads } from '../middlewares/multer.middleware.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter=new Router();

userRouter.route("/register").post(uploads.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 }
]),registerUser);

userRouter.route("/login").post(loginUser);

userRouter.route("Token-Refresh").post(refreshAccessToken);

// secured route
userRouter.route("/logout").post(verifyJWT, logoutUser);

// This route is for updating the user's avatar
userRouter.route("/updateAvatar").put(verifyJWT, uploads.single('avatar'), updateUserAvatar);
  
// This route is for updating the user's cover photo
userRouter.route("/updateCoverPhoto").put(verifyJWT, uploads.single('coverPhoto'), updateUserCoverPhoto);

// This route is for updating the user's profile information
userRouter.route("/updateProfile").put(verifyJWT, updateUserProfile);

export { userRouter };