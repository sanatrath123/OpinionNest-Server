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
    isDeleted:{type:Boolean , default:false}
}, {  virtuals:{
    totlaCmt:{get(){
     return   this.comments?.length
    },
    }
} , 
methods:{
    deleteModel(val){
        console.log(val)
       return this.isDeleted ? this.isDeleted=false : this.isDeleted=true
    },

    //user commnets crud
    deleteUserCmt(id){
 this.comments = this.comments.filter((userCmt)=>userCmt.id != id)
    }
}
,
  strict:"throw", timestamps:true})



const commentModel = mongoose.model('comment', commentSchema)

export default commentModel
