import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import userRoutes from './Routes/userRoutes.js'
import postRoutes from "./Routes/postRoutes.js"


import "./config/db.js"

const app = express()
const port = process.env.port 

app.use(cors({
    origin:'http://localhost:5173', credentials:true
}))
app.use(cookieparser())


app.use("/user",userRoutes )
app.use("/post",postRoutes)

app.use((err,req,res,next)=>{
    res.status(404).json({error:"internal server error"})
})

app.listen(port, ()=>{
    console.log("App is listing at port", port)
})