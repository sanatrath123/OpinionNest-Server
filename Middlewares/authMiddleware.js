import userModel from "../Model/userModel.js"

const AuthCheeck = async(req,res,next)=>{
    const {uid} = req.cookies
    if(!uid) return res.status(409).json({err:"user not allowed"})
    const {id , expire} = JSON.parse(Buffer.from(uid , 'base64url').toString('utf-8'))
    if(!id && !expire ) return res.status(405).json({err:"you are not allowed to accsess"})
        const currentTime =Math.floor( Date.now()/1000)
    if(expire-currentTime < 0){
        res.clearCookie('uid')
        return res.status(200).json({message:"user loged out"})
    }
    const userData = await userModel.findById(id , 'name email ')
    if(!userData._id) return res.status(404).json({err:"user does not exist"})
    req.userData = userData
    next()
    // const {uid} = req.cookies
    // const userData = await userModel.findById(uid, 'name email ')
    // if(!userData._id) return res.status(404).json({err:"user does not exist"})
    // req.userData = userData
    // next()
}

export default AuthCheeck