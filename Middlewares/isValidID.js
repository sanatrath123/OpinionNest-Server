import mongoose from "mongoose";

const CheeckID = (req,res,next,id)=>{
 mongoose.isValidObjectId(id) ? next() : next(Error)
}
export default CheeckID

