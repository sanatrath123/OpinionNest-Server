import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name:{
        type:String , minLength:4 , required:true
    },
    email:{
        type:String , match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , required:true, trim:true , lowercase:true,unique:true
    },
    password:{
        type:String , minLength:4 , required:true
    }
},{timestamps:true, strict:"throw"})


const userCol =  mongoose.model("user",userSchema)

export default userCol