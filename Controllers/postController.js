import mongoose from "mongoose"
import PostModel from "../Model/postModel.js";
import commentModel from "../Model/commentsModel.js";


export const CreateNewPost = async (req,res,next)=>{
const session = await mongoose.startSession()
const {title , content} = req.body
const filesInfo = req.files.files.map((item)=>{return {_id:item.id , extension:item.extension}})
const newPostId = new mongoose.Types.ObjectId()
const newCmtSecId = new mongoose.Types.ObjectId()

session.startTransaction()
try {
    //create methord use new Model(doc).save() behibd the scene so it wont support tarnsaction
    await PostModel.insertOne({_id:newPostId  , title , content , filesInfo,commentSection:{id:newCmtSecId} , author:new mongoose.Types.ObjectId() }, {session:session})
    await commentModel.insertOne({_id:newCmtSecId,postId:newPostId}, {session})
    await session.commitTransaction()
    res.status(201).json({message:"post created successfully"})
} catch (error) {
    await session.abortTransaction()
    console.log("error while creating the post", error)
    next(error)
}finally{
    await session.endSession()
    console.log("session ended")
}
}

//GetAll posts
export const GetAllPosts = async (req,res,next)=>{
   try {
    //const AllPosts = await PostModel.find().populate({path:'author' , select:'name'})
    const AllPosts = await PostModel.find().populate({path:'author' , select:'name'})
    res.status(200).json(AllPosts)
   } catch (error) {
    console.log("error whiel geting all post")
    res.status(404).json({err:"can not retrive the posts"})
   }
}

//Get post by ID
export const Getpost = async (req,res,next)=>{
const {id} = req.params
const postData = await PostModel.findOne({_id:id})
res.status(200).json(postData)
}
