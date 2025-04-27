import express from "express";
import mongoose from "mongoose";
import multer from 'multer';
import path from "path";
import { CreateNewPost, Getpost, DeletePost,UpdatePostByAuthor ,Like_Dislike_SavePost,OptimizeGetPost} from "../../Controllers/posts/postController.js";
import CheeckID from "../../Middlewares/isValidID.js";
import fs from 'fs';
import commentsRoutes from './commentRoutes.js'

const router = express.Router()

router.use('/comments',commentsRoutes )

router.param('postId',CheeckID)


const storage = multer.diskStorage({
    destination: function (req, file,cb){
cb(null , './uploads')
    },
    filename:function(req,file , cb){
        console.log(file?.originalname,"from routes")
        const extension = path.extname(file?.originalname)
        const fileId = new mongoose.Types.ObjectId()
        file.id = fileId
        file.extension = extension
        cb(null ,`${fileId}${extension}` )
    }
})

const upload = multer({storage:storage})
router.post('/', upload.fields([{name:'files', maxCount:4}]) ,CreateNewPost)

router.get('/',OptimizeGetPost)
router.route('/:postId').get(Getpost).delete(DeletePost).patch(UpdatePostByAuthor)

router.put("/:postId/:action", Like_Dislike_SavePost)

router.get('/file/:fileId', async (req,res,next)=>{
    const {fileId} = req.params
    const fileName = fileId.split('.')?.[0]
 if(mongoose.isValidObjectId(fileName)){
    const readStream = fs.createReadStream(`${process.cwd()}/uploads/${fileId}`)
    readStream.pipe(res)
    return
 }else{
    console.log("invalid file id")
 }
    })





export default router