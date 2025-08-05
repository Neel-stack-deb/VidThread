import { mongoose, Schema } from "mongoose";

const userSchema = new Schema({
  

},{

});

userSchema.methods();

userSchema.pre('save',function(){
  
});


export const User = new model('User', userSchema);

