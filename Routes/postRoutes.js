import express from "express";
import mongoose from "mongoose";
import multer from 'multer'
import path from "path"
import { CreateNewPost,GetAllPosts,  Getpost } from "../Controllers/postController.js";
import PostModel from "../Model/postModel.js";
import commentModel from "../Model/commentsModel.js";
import CheeckID from "../Middlewares/isValidID.js";

const router = express.Router()

router.param('id',CheeckID)


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



router.get('/:id',Getpost)

router.patch('/:id',()=>{
    console.log("hi from router")
} )

export default router