import express from 'express'
import {AddNewCmnt,GetAllComments,EditComment,DeleteComment,LikeComment} from '../../Controllers/posts/commentsController.js'
import CheeckID from '../../Middlewares/isValidID.js'

const router = express.Router()

router.param('/:cmntid', CheeckID)
router.route('/:cmtId').post(AddNewCmnt).get(GetAllComments).delete(DeleteComment).put(EditComment)
router.put('/:action/:cmntId',LikeComment)


export default router