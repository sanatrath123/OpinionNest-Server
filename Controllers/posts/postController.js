import mongoose from "mongoose"
import PostModel from "../../Model/posts/postModel.js";
import commentModel from "../../Model/posts/commentsModel.js";
import fs from 'node:fs/promises'

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
try {
    const postData = await PostModel.findOne({_id:id}).populate( 'commentSection' )
//add {path:'author' , select:'name'} ,after implementing user routes
console.log(id)
res.status(200).json(postData)
} catch (error) {
    console.log("error while get the file", error)
}
}

//delete post 
export const DeletePost = async (req,res,next)=>{
   const session = await mongoose.startSession()
const {postId} = req.params

try {
    const postData = await PostModel.findOne({_id:postId})
    const postCmt = await commentModel.findOne({_id:postData.commentSection.id})
   //using the methords 
  postData.softDeletePost()
  postCmt.deleteModel()

  //start the transactions
 session.startTransaction()
await postData.save({session})
await postCmt.save({session})
//taking the files to cache
for(let item of postData.filesInfo){
    await fs.rename(`${process.cwd()}/uploads/${item._id}${item.extension}` , `${process.cwd()}/cache/${item._id}${item.extension}`, async()=>{
        console.log("error while taking files to cache")
        await  session.abortTransaction()
        next(new Error())
    })
 }
await session.commitTransaction()
res.status(200).json(postData)
} catch (error) {
  await  session.abortTransaction()
    console.log("error while delting the post", error)
    res.status(404).json({msg:"error while delete the post"})
}finally{
   await session.endSession()
}
}


//updated by the author 
export const UpdatePostByAuthor = async (req,res,next)=>{
   const {title , content} = req.body
   const postData = await PostModel.findOne({_id:req.params.postId , author:req.userData._id}).lean()
   if(!postData._id){
   return res.status(401).json({err:"user not allowed to make any changes"})
   }
postData.title = title
postData.content= content
try {
  const updatedData=  await postData.save()
    res.status(200).json(updatedData.toJSON())
} catch (error) {
    console.log("error while updating the post tiltle and content", error)
    next(new Error())
}
}

//like comment and save by other user to a post
export const LikeOrSavePost = async(req,res,next)=>{
if(req.params.postId || req.params.action) return res.status(404).json({err:"Send a valid post"})
const postData =await PostModel.findById(req.params.postId)
if(req.params.action=="like"){
   postData.likeUnLike(req.userData._id)
}
if(req.params.action=="save"){
    postData.SaveUnSave(req.userData._id)
}
await postData.save()
}

//restore the post
