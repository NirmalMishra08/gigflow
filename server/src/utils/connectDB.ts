import mongoose from "mongoose"

export async function ConnectDB(URI :string) {
    try {
     
        await mongoose.connect(URI as string)
        console.log("MongoDB connected successfully");
        
    } catch (err) {
        console.log("Error occurred while connecting to MongoDB:", (err as Error).message);
        process.exit(1);
    }

}