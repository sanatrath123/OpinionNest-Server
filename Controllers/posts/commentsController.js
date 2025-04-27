import mongoose from 'mongoose'
import commentModel from '../../Model/posts/commentsModel.js'

export const AddNewCmnt = async(req,res,next)=>{
    const userId = req.userData._id
    const usercmt = req.body.comment
    const cmtSecId = req.params.cmtId
   try {
  await commentModel.findByIdAndUpdate({_id:cmtSecId} , {$push:{comments:{userId , usercmt}}}, {session})
    res.status(201).json({msg:"new cmnt added"})
   } catch (error) {
   await session.abortTransaction()
    console.log("error while adding a commnet" , error)
    next(new Error())
   }

}


export const GetAllComments = async(req,res,next)=>{
        const uid = req.userData?._id
        const {cmtId} = req.params
 try {
const data = await commentModel.aggregate([
    {
        $match:{
            _id: new mongoose.Types.ObjectId(String(cmtId)), isDeleted:false
        }
    },{
        $unwind:"$comments"
    },
    {
        $sort:{
            "comments.likes":-1
        }
            },
    {
        $lookup:{
            from:'users',
            localField:'comments.userId',
            foreignField:"_id",
            pipeline:[
                {
                    $project:{name:1}
                }
            ],
            as:'comments.userId'
        }
    },
    {
        $addFields:{
            "comments.totalLikes":{$size:"$comments.likes"},
            "comments.totalDownVote":{$size:"$comments.dislikes"},
            "comments.isLiked":{$in:[uid ,"$comments.likes"]},
            "comments.isDisLike":{$in:[uid ,"$comments.dislikes"]},
        }
    },
    {
        $project:{
            "comments.likes":0 , "comments.dislikes":0
        }
    }  ,
    {
         $unwind:"$comments.userId"
    }
    ,{
        $unwind:"$comments"
    },

    {
        $group:{
            _id:"$_id",
            comments:{$push:"$comments"},
            postId:{$first:"$postId"}
        }
    },
])
res.status(200).json(data?.[0])
 } catch (error) {
    console.log('errro while get the cmt', error)
    next(new Error())
 }
    }


export const DeleteComment = async(req,res,next)=>{
    const userData = req.userData
    const {delcmntId} = req.body
   
 try {
  await commentModel.updateOne({_id:req.params.cmtId } ,
        {
        $pull:{comments:{userId:userData._id , _id:delcmntId}}
    },
       {new:true}
       )
    res.status(200).json({msg:"cmnt deleted"})
 } catch (error) {
    console.log("error while delete the cmnt", error)
    next(new Error())
 }
}


export const EditComment =  async(req,res,next)=>{
    const userData = req.userData
    const {newCommnet, prevCmnt} = req.body
    const comntId = req.params.cmtId
    try {
        const cmntRes = await commentModel.updateOne({_id:comntId , 'comments.userId':userData._id , 'comments.usercmt':prevCmnt}, {$set:{'comments.$usercmt':newCommnet}})
        if(cmntRes.modifiedCount)return res.status(200).json({msg:"edit the prev comnt"})
    return res.status(404).json({err:"new cmnt nit added"})
    } catch (error) {
        console.log("error in cmt edit", error)
        next(new Error())
    }
}


export const LikeComment= async (req,res,next)=>{
    const userData = req.userData
    const { cmtSecId, isLiked, isDisliked} = req.body
    const {cmntId,action} = req.params
    let updatedData 
   try {
if(action=='like'){
    if(isLiked){
        updatedData=  await commentModel.updateOne({ _id: cmtSecId, 'comments._id':cmntId }, 
              { $addToSet: { 'comments.$.likes': userData._id },
              $pull:{'comments.$.dislikes':userData?._id}
           });
         if(!updatedData.modifiedCount)  return next(new Error)
           return  res.status(200).json({msg:"liked cmnt"})
      }
      updatedData = await commentModel.updateOne({_id:cmtSecId, "comments._id":cmntId},
          {$pull:{"comments.$.likes":userData?._id}})
        if(!updatedData.modifiedCount) return next(new Error)
           return res.status(200).json({msg:"like removed"})
      } 
      if(!isDisliked){
        updatedData = await commentModel.updateOne({_id:cmtSecId,"comments._id":cmntId },
            { $addToSet: { 'comments.$.dislikes': userData._id },
              $pull:{'comments.$.likes':userData?._id}}
        )
        if(!updatedData.modifiedCount)  return next(new Error)
            return  res.status(200).json({msg:"disliked cmnt"})
    }
    updatedData = await commentModel.updateOne({_id:cmtSecId, "comments._id":cmntId},
        {$pull:{"comments.$.dislikes":userData?._id}})
      if(!updatedData.modifiedCount) return next(new Error)
         return res.status(200).json({msg:"dislike removed"})
}
catch (error) {
    return   console.log("error while user like and dislike the cmt", error)
}
}

