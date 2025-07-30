import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";
import { db_name } from "../constants.js";

export async function connectToDatabase(){
  try{
    const connection= await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`);
    return connection;
  }catch(error){
    console.log("DATABASE CONNECTION ERROR: ", error.message)
    return error;
  }
}