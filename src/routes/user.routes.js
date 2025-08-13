import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { uploads } from '../middlewares/multer.middleware.js';
const userRouter=new Router();

userRouter.route("/register").post(uploads.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 }
]),registerUser);



export { userRouter };