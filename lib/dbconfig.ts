import mongoose from "mongoose";

export async function connect() {
    try{
        // Prevent multiple connections
        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;

        connection.on('connected',()=>{
            console.log('Mongo connected Successfully')
        })

        connection.on('error',(err)=>{
            console.log('mongodb giving some error. Please make sure MongoDB is running' + err);
            process.exit();
        })

    } catch (error) {
        console.log("Something went wrong");
        console.log(error);
    }
}