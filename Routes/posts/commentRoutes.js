import express from 'express'
import {AddNewCmnt,GetAllComments,EditComment,DeleteComment,LikeComment,DisLikeComment} from '../../Controllers/posts/commentsController.js'
import CheeckID from '../../Middlewares/isValidID.js'

const router = express.Router()

router.param('/:cmntid', CheeckID)
router.route('/:cmtId').post(AddNewCmnt).get(GetAllComments).delete(DeleteComment).put(EditComment)
router.put('/like/:cmntId',LikeComment)
router.put('/dislike/:cmtId',DisLikeComment)

export default router