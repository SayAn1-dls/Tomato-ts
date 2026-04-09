import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// 🔥 Global Error Handlers (never let your app die silently)
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
});

// 🚀 App Config
const app = express();
const port = process.env.PORT || 5002;

// 🧩 Middlewares
app.use(express.json());

// 🌍 CORS - Fully open but safe for dev
app.use(cors({
  origin: true, // allow all origins dynamically
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🛑 Handle preflight requests
app.options("*", cors());

// 🔍 Debug incoming requests (optional but useful)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} request from ${req.headers.origin || "unknown origin"} → ${req.url}`);
  next();
});

// 🗄️ Database Connection
connectDB();

// 📦 API Routes
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// 🏠 Test Route
app.get("/", (req, res) => {
  res.send("✅ API Working");
});

// 🚀 Start Server
const server = app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});

// ❌ Handle server errors (like port already in use)
server.on("error", (err) => {
  console.error("❌ Server Error:", err.message);

  if (err.code === "EADDRINUSE") {
    console.log(`⚠️ Port ${port} is already in use.`);
    console.log("👉 Run: kill -9 $(lsof -ti :" + port + ")");
  }
});