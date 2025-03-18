import express from 'express'
import {Signup,Login,Logout,GetuserData} from "../Controllers/userController.js"
import AuthCheeck from "../Middlewares/authMiddleware.js"


const router = express.Router()

router.post("/signup", Signup)
router.post("/login", Login)
router.post("/logout",AuthCheeck, Logout)
router.get("/userdata",AuthCheeck, GetuserData)

export default router
