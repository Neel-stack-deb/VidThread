import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.models.js';


export const registerUser = asyncHandler(async (req, res) => {
  //First we will take the data from the frontend

  const { fullname, password, email, userName } = req.body;

  // Then we will validate the data.

  if([fullname, password, email, userName].some(field=>{
    field==="";
  })){throw new ApiError(400,"All fields are required.")};

  //then we will chack if the user already exists

  if(User.findOne(userName)){
    throw new ApiError(202,"Username already exists.");
  }

  //check for images and avater (all the compuslary fields)

  const { avater, coverImage } = req.file;
  if(!avater){
    throw new ApiError(403,"Avater required.");
  }

    

  //upload the image to the claudinary
  //then we will create the user in the database
  //then we will send the response to the frontend
  
});  