import userModel from "../Model/userModel.js"


export const Signup = async(req,res,next)=>{
    console.log(req.body)
const {name , email , password} = req.body
try {
   const userData =  await userModel.create({name, email , password})
     setCookies(res, userData._id)
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
    if(!userData._id) res.status(404).json({message:"user does not exist"})
    setCookies(res, userData._id)
    res.status(200).json({message:"user loged in"})
 }

export const Logout = (req,res,next)=>{
    res.clearCookie('uid')
    res.status(200).json({message:"user loged out"})
}

export const GetuserData = (req,res,next)=>{
    const {userdata} = req
    res.status(200).json({name:userdata?.name , email:userdata?.email})
}


const setCookies = (res, id)=>{
    res.cookie('uid', id, {httpOnly:true , maxAge:3600*1000*24 , secure:true, sameSite:'none'})
}