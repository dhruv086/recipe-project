import express from "express";
import connectDB from "./lib/db.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
console.log("Spoonacular API Key:", process.env.SPOONACULAR_API_KEY);
const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL // e.g., https://your-frontend.onrender.com
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))

app.use(express.json());

app.use(cookieParser())

import userRoute from "./src/routes/user.route.js"
import spoonacularRoute from "./src/routes/spoonacular.route.js"

app.use("/api/user",userRoute)
app.use("/api/recipe", spoonacularRoute)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(process.env.PORT,()=>{
  console.log("server is running",process.env.PORT)
  connectDB();
})