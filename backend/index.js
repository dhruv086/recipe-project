import express from "express";
import connectDB from "./lib/db.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();
console.log("Spoonacular API Key:", process.env.SPOONACULAR_API_KEY);
const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

app.use(express.json());

app.use(cookieParser())

import userRoute from "./src/routes/user.route.js"
import spoonacularRoute from "./src/routes/spoonacular.route.js"

app.use("/api/user",userRoute)
app.use("/api/recipe", spoonacularRoute)

// Serve static files from the frontend build
app.use(express.static(path.join(process.cwd(), "dist")));

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

app.listen(process.env.PORT,()=>{
  console.log("server is running",process.env.PORT)
  connectDB();
})