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
    author:{
        type:Schema.Types.ObjectId , required:true, ref:'user'
    },
    commentSection:{
id:Schema.Types.ObjectId , totalCmt:{type:Number, default:0}
    },
    filesInfo:{ type:[fileSchema], default:[] }
}, {
    methods:{
        settotalCmt(val){
            if(val=="remove" &&  this.commentSection.totalCmt>0){
return this.commentSection.totalCmt-=1
            }
            return this.commentSection.totalCmt+=1
        }
    },
    strict:'throw' , timestamps:true})


const PostModel = mongoose.model("post", postSchema)

export default PostModel
