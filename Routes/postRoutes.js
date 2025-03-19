import express from "express";
import mongoose from "mongoose";
import multer from 'multer'
import path from "path"
import PostModel from "../Model/postModel.js";

const router = express.Router()

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

router.post('/', upload.fields([{name:'files', maxCount:4}]) ,async (req,res,next)=>{
const {title , content} = req.body
const filesInfo = req.files.files.map((item)=>{return {_id:item.id , extension:item.extension}})

const newPost = {title , content , filesInfo , author:new mongoose.Types.ObjectId() }

try {
    await PostModel.create(newPost)
    res.json({newPost})
} catch (error) {
    console.log("error while creating the post", error)
    next(error)
}
})


router.get('/',(req,res,next)=>{
    const data = req.body
res.json({mes:"hello"})
})


export default router