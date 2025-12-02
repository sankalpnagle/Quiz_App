import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import adminQuizRoutes from './src/routes/adminQuizRoutes.js'
import quizRoutes from './src/routes/quizRoutes.js'

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "*",
}));
app.use(express.json());


// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminQuizRoutes); // /api/admin/quizzes...
app.use("/api/quizzes", quizRoutes); 

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
