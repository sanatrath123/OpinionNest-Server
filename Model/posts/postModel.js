import mongoose, { Schema, set } from 'mongoose'

const fileSchema = new Schema({
_id:{
    type:Schema.Types.ObjectId , required:true
},
extension:{
    type:String , required:true
}
})

const postSchema = new Schema({
    title:{
        type:String , minLength:4 ,maxLength:70 , required:true
    },
    content:{
        type:String , minLength:5 , maxLength:200 , required:true
    },
    likes:{ type:[Schema.Types.ObjectId], default:[] },
    downVote:{type:[Schema.Types.ObjectId], default:[] },
    author:{
        type:Schema.Types.ObjectId , required:true, ref:'user'
    },

savedUsers:{type:[Schema.Types.ObjectId], default:[] },

    commentSection:{
id:{type:Schema.Types.ObjectId , ref:'comment'} , totalCmt:{type:Number, default:0}
    },
    filesInfo:{ type:[fileSchema], default:[] },
    isDeleted:{type:Boolean , default:false}
}, {
    methods:{
        settotalCmt(val){
            if(val=="remove" &&  this.commentSection.totalCmt>0){
return this.commentSection.totalCmt-=1
            }
            return this.commentSection.totalCmt+=1
        },
softDeletePost(){
   return this.isDeleted ? this.isDeleted=false : this.isDeleted=true
}, 
},  
strict:'throw' , timestamps:true, toJSON:{virtuals:true} , toObject:{virtuals:true}})

postSchema.virtual('TotalLikes').get(function(){
    return  this.likes.length
})

postSchema.virtual('TotalDownVote').get(function(){
    return  this.downVote.length
})
postSchema.virtual('TotalSaves').get(function(){
    return  this.savedUsers.length
})



const PostModel = mongoose.model("post", postSchema)

export default PostModel
