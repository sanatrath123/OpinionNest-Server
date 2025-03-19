import mongoose, { Schema } from "mongoose";

const userCommentsSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId , required:true, ref:"user"
    },
    usercmt:{
        type:String , required:true, maxLength:[100, "you can not use more than 100 char"]
    }

})

const commentModel = new Schema({
    postId:{
        type:Schema.Types.ObjectId , required:true
    },
    comments:{ type:[userCommentsSchema] , default:[]}
}, {strict:"throw", timestamps:true})

