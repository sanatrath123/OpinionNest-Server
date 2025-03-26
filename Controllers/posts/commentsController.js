import commentModel from '../../Model/posts/commentsModel.js'
import PostModel from '../../Model/posts/postModel.js'

export const AddNewCmnt = async(req,res,next)=>{
    const userId = req.userData._id
    const usercmt = req.body.comment
   try {
    await commentModel.findByIdAndUpdate(req.params.cmtId , {$push:{comments:{userId , usercmt}}})
    res.status(201).json({msg:"new cmnt added"})
   } catch (error) {
    console.log("error while adding a commnet" , error)
    next(new Error())
   }
}

export const GetAllComments = async(req,res,next)=>{
    try {
        const comments = await commentModel.findById(req.params.cmtId).lean()
    res.status(200).json(comments)
    } catch (error) {
        console.log("error while delete the cmnt", error)
        next(new Error())
    }  }


export const DeleteComment = async(req,res,next)=>{
    const userData = req.userData
    const {delcmnt} = req.body
   
 try {
    const data = await commentModel.findOneAndUpdate({_id:req.params.cmtId } ,
        {
        $pull:{comments:{userId:userData._id , usercmt:delcmnt}}
    },
       {new:true}
       ).lean()
    res.status(200).json(data)
 } catch (error) {
    console.log("error while delete the cmnt", error)
    next(new Error())
 }
}


export const EditComment =  async(req,res,next)=>{
    const userData = req.userData
    const {newCommnet, prevCmnt} = req.body
    const comntId = req.params.cmtId
    const cmntSec = await commentModel.findOneAndUpdate({_id:comntId , 'comments.userId':userData._id , 'comments.usercmt':prevCmnt}, {$set:{'comments.$usercmt':newCommnet}}, {new:true})
   if(!cmntSec._id) return next(new Error())
    try {
        await cmntSec.save()
    } catch (error) {
        console.log("error in cmt edit", error)
        next(new Error())
    }
}


export const LikeComment= async (req,res,next)=>{
    const userData = req.userData
    const { cmtSecId} = req.body
    const {cmntId} = req.params
    const commnetSec = await commentModel.findById(cmtSecId)
//not db call only looping
   const actionComment = commnetSec.comments.find((item)=>item._id.toString()== cmntId)
   const action = actionComment.likes.includes(userData._id) 
   
if(action){
   try {
    const data = await commentModel.updateOne({_id:cmtSecId, 'comments._id':req.params.cmntId}, 
        {$pull:{'comments.$.likes':userData._id}})
   return res.status(200).json(data)
   } catch (error) {
   return console.log("while remove the like from cmt",error)
   }
}

try {
    const data = await commentModel.updateOne(
        { _id: cmtSecId, 'comments._id': req.params.cmntId }, 
        { $addToSet: { 'comments.$.likes': userData._id } }
      );
    res.status(200).json(data)
} catch (error) {
 return   console.log("error while user like the cmt", error)
}
   
}

export const DisLikeComment = async(req, res)=>{
    const userData = req.userData
    const {cmtId} = req.params
    const {cmtSecId} = req.body
const commentsec =await commentModel.findById(cmtSecId)

const targetCmnt = commentsec.comments.find((item)=>item._id.toString()==cmtId) 
const action = targetCmnt.dislikes.includes(userData._id)
console.log(action)
if(action){
  try {
    await  commentModel.updateOne(
        {_id:cmtSecId , 'comments._id':cmtId},
        {$pull:{'comments.$.dislikes':userData._id}}
    )
   return res.status(200).json("dislike removed")
  } catch (error) {
    console.log("erroe while remove dislike a cmnt", error)
  return  res.status(404)
  }
}
try {
    await commentModel.updateOne({_id:cmtSecId , 'comments._id':cmtId},
        {$addToSet:{'comments.$.dislikes':userData._id}})
        return res.status(200).json("dislike added")
} catch (error) {
    console.log("error while dislike a cmnt ", error)
    return  res.status(404)
}

}