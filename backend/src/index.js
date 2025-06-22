import express from 'express';
import "dotenv/config";
import connectDB from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import cors from "cors";
import cookieParser from "cookie-parser";
import path from 'path';

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

const __dirname = path.resolve();

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ limit: "16kb", extended: true }))
// app.use(express.static("public"))
app.use(cookieParser())



app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);



if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/*path", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: err.error || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});


connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);

        });
    })
    .catch((error) => {
        console.log("MongoDB connection Error !! ", error);

    })





