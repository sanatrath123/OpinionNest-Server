import mongoose, { get, Schema } from "mongoose";

const userCommentsSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId , required:true, ref:"users"
    },
    usercmt:{
        type:String , required:true, maxLength:[100, "you can not use more than 100 char"]
    }
})

const commentSchema = new Schema({
    postId:{
        type:Schema.Types.ObjectId , required:true
    },
    comments:{ type:[userCommentsSchema] , default:[]},
}, {  virtuals:{
    totlaCmt:{get(){
     return   this.comments?.length
    },
    }
} , 
  strict:"throw", timestamps:true})

const commentModel = mongoose.model('comment', commentSchema)

export default commentModel
