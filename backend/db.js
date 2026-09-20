import mongoose from "mongoose";
import dns from "dns"

const connectDB = () => {
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        console.error('MONGO_URI is not set in .env');
        process.exit(1);
    }
    mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.error('Database connection error', err));

}

export default connectDB;
