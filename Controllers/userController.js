import userModel from "../Model/userModel.js"


export const Signup = async(req,res,next)=>{
    console.log(req.body)
const {name , email , password} = req.body
try {
   const userData =  await userModel.create({name, email , password})
   return res.status(201).json({message:"new user created successfully"})
} catch (error) {
    console.log("error while creating a new user",error)
if(error.code==11000 && error.keyValue.email) return res.status(409).json({err:"same email allready exist"})
    next(error)
}
}


export const Login = async(req,res,next)=>{
    const {email , password} = req.body
    if(!email && !password) return res.status(404)
    const userData = await userModel.findOne({email, password}).lean()
const cookiesPayload = {
    id:userData?._id , expire:Math.floor(Date.now()/1000 + 60*60*24)
}
    if(!userData?._id)return res.status(404).json({message:"user does not exist"})
        res.cookie('uid', Buffer.from(JSON.stringify(cookiesPayload)).toString('base64url') , { httpOnly:true , maxAge:24*60*60*1000, sameSite:'none', secure:true})
    console.log("yo")
    res.status(200).json({message:"user loged in"})
 }

export const Logout = (req,res,next)=>{
    console.log("logout")
    res.clearCookie('uid')
    res.status(200).json({message:"user loged out"})
}

export const GetuserData = (req,res,next)=>{
    const {name ,email, id} = req.userData
    res.status(200).json({name , email,id})
}

