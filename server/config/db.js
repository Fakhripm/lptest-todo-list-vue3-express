import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(`数据库连接成功，端口为: ${process.env.MONGODB_URI}`);
    } catch (err) {
        console.log(`数据库连接失败:\n`, err.message);
        process.exit(1)
    }
}

export default connectDB