import express from "express";
import mongoose from "mongoose";
import multer from 'multer';
import path from "path";
import { CreateNewPost, GetAllPosts, Getpost, DeletePost,UpdatePostByAuthor ,LikeOrSavePost} from "../Controllers/postController.js";
import PostModel from "../Model/postModel.js";
import commentModel from "../Model/commentsModel.js";
import CheeckID from "../Middlewares/isValidID.js";
import fs from 'fs';

const router = express.Router()

router.param('postId',CheeckID)


const storage = multer.diskStorage({
    destination: function (req, file,cb){
cb(null , './uploads')
    },
    filename:function(req,file , cb){
        const extension = path.extname(file?.originalname)
        const fileId = new mongoose.Types.ObjectId()
        file.id = fileId
        file.extension = extension
        cb(null ,`${fileId}${extension}` )
    }
})

const upload = multer({storage:storage})

router.post('/', upload.fields([{name:'files', maxCount:4}]) ,CreateNewPost)

router.get('/',GetAllPosts)

router.route('/:postId').get(Getpost).delete(DeletePost).patch(UpdatePostByAuthor)

router.put("/:postId/:action", LikeOrSavePost)

router.get('/file/:fileId', async (req,res,next)=>{
    const {fileId} = req.params
    const readStream = fs.createReadStream(`${process.cwd()}/uploads/${fileId}`)
    readStream.pipe(res)
    })





export default router