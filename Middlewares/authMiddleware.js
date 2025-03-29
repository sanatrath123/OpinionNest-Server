import userModel from "../Model/userModel.js"

const AuthCheeck = async(req,res,next)=>{
    const {uid} = req.cookies
    if(!uid) return res.status(405).json({err:"you are not allowed to accsess"})
    const userData = await userModel.findById(uid , 'name email ')
if(!userData._id) return res.status(404).json({err:"user does not exist"})
    req.userData = userData
next()
}

export default AuthCheeck