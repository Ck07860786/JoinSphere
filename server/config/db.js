import mongoose from "mongoose";
 const mongoConnect = async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`database connected ${connect.connection.host}`)
    } catch (error) {
        console.log(error)
    }
 }
 export default mongoConnect