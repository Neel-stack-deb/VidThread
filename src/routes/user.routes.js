import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken } from "../controllers/user.controllers.js";
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

export { userRouter };