import express from "express";
import cors from "cors";
import "dotenv/config";
import "express-async-errors";
import connectDB from "./config/database.ts";
import authRoutes from "./routes/auth.ts";
import productRoutes from "./routes/products.ts";
import orderRoutes from "./routes/orders.ts";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://rentcampoutdor.netlify.app",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend OutdoorCamp berjalan dengan baik",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
  });
});

// Error handler
app.use((error: any, req: any, res: any, next: any) => {
  console.error("Error:", error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Terjadi kesalahan pada server",
  });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🏕️  OutdoorCamp Backend API 🏕️     ║
║                                        ║
║  Server berjalan di port ${PORT}         ║
║  Environment: ${process.env.NODE_ENV}       ║
║  MongoDB: ${process.env.MONGODB_URI ? "✅ Connected" : "❌ Disconnected"}      ║
╚═════════════════════════════════���══════╝
  `);
});

export default app;
