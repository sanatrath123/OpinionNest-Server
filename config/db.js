import mongoose from 'mongoose'

try {
    await mongoose.connect(process.env.DB_URL)
    console.log("db connected")
} catch (error) {
    console.log("error while connecting the db")
}

process.on("SIGINT", async()=>{
try {
    await mongoose.disconnect()
    console.log("db disconnected")
process.exit()
} catch (error) {
    console.log("error while db disconnect")
}
})