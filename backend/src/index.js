import express from 'express';
import "dotenv/config";
import connectDB from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use( cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ limit: "16kb", extended: true }))
// app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);


connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);

        });
    })
    .catch((error) => {
        console.log("MongoDB connection Error !! ", error);

    })





