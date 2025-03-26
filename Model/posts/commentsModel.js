import mongoose, { get, Schema } from "mongoose";

const userCommentsSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId , required:true, ref:"users"
    },
    usercmt:{
        type:String , required:true, maxLength:[100, "you can not use more than 100 char"]
    },
    likes:{
        type:[Schema.Types.ObjectId] , default:[]
    },
    dislikes:{
        type:[Schema.Types.ObjectId], default:[]
    }
},{

})

const commentSchema = new Schema({
    postId:{
        type:Schema.Types.ObjectId , required:true
    },
    comments:{ type:[userCommentsSchema] , default:[]},
    isDeleted:{type:Boolean , default:false}
}, {  
    virtuals:{
    totlaCmt:{
 get(){
     return   this.comments?.length
    }
    }
} , 
methods:{
    deleteModel(val){
        console.log(val)
       return this.isDeleted ? this.isDeleted=false : this.isDeleted=true
    },
}
,
  strict:"throw", timestamps:true})



const commentModel = mongoose.model('comment', commentSchema)

export default commentModel
