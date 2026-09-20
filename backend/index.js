import 'dotenv/config';
import path from 'path';
import express from 'express';
import connectDB from './db.js';
import cors from 'cors';

import favouriteRoutes from './Routes/Favourite.routes.js';
import adminRoutes from "./Routes/Admin.routes.js";
import propertyRoutes from "./Routes/Property.routes.js";
import userRoutes from "./Routes/User.routes.js";
import authRoutes from "./Routes/Auth.routes.js";
import chatRoutes from "./Routes/Chat.routes.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

connectDB();


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favourite", favouriteRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/chat", chatRoutes);


//app.use('/api/users', userRoutes);
//app.use('/api/doctors', doctorRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
