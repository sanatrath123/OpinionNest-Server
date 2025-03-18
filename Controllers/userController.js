import userModel from "../Model/userModel.js"


export const Signup = async(req,res,next)=>{
const {name , email , password} = req.body

const isExist =await userModel.findOne({email:email}).lean()
if(isExist?._id)return res.status(409).json({err:"user already exist"})
try {
     await userModel.create({name, email , password})
    res.status(201).json({message:"new user created successfully"})
} catch (error) {
    console.log("error while creating a new user")
    next(error)
}



}
export const Login = (req,res,next)=>{

}
export const Logout = (req,res,next)=>{

}
export const GetuserData = (req,res,next)=>{

}