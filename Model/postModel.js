import mongoose, { Schema } from 'mongoose'


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
    author:{
        type:Schema.Types.ObjectId , required:true
    },
    filesInfo:{ type:[fileSchema], default:[] }
}, {strict:'throw' , timestamps:true})


const PostModel = mongoose.model("post", postSchema)

export default PostModel
