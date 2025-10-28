import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js"; // PostgreSQL connection pool
import authRoutes from "./Routes/authRoutes.js";
import campaignRoutes from "./Routes/campaignRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";
// import paymentRoutes from "./Routes/paymentRoutes.js"; // Disabled for now
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// CORS Configuration - Allow frontend to connect
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'], // Vite default ports
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Test PostgreSQL connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
  } else {
    console.log("✅ PostgreSQL connected at:", res.rows[0].now);
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/upload", uploadRoutes);
// app.use("/api/payments", paymentRoutes); // Disabled for now

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
