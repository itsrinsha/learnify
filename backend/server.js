import express from "express";
import cors from "cors";

import { env } from "./config/env.config.js";
import connectDB from "./config/db.js";
//routes
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import instructorRoutes from "./routes/instructorRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import liveRoutes from "./routes/liveRoutes.js"
import examRoutes from "./routes/examRoutes.js"
import progressRoutes from "./routes/progressRoutes.js"
import certificateRoutes from "./routes/certificateRoutes.js"

//middleware
import errorMiddleware from "./middleware/errorMiddleware.js"
import roleMiddleware from "./middleware/roleMiddleware.js"



console.log('server.js loaded');
const app = express();

console.log('connectDB function:', connectDB);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
connectDB(env.MONGO_URL);

app.use(cors({ 
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())


app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/instructor",instructorRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/live",liveRoutes)
app.use("/api/exams", examRoutes)
app.use("/api/progress", progressRoutes)
app.use("/api/certificates", certificateRoutes)
app.use(errorMiddleware);

const PORT =process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

