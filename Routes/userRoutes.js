import express from 'express'
import {Signup,Login,Logout,GetuserData} from "../Controllers/userController"

const router = express.Router()

router.post("/signup", Signup)
router.post("/login", Login)
router.post("/logout", Logout)
router.get("/userdata", GetuserData)

export default router
