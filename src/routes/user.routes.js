import { Router } from {express};
import { registerUser } from "../controllers/user.controllers.js";
const userRouter=new Router();

userRouter.route("/register").post(registerUser);



export { userRouter };