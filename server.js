const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// --- Configuration ---
dotenv.config();
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
// Test route
app.get("/", (req, res) => {
  res.send("Mandal Donation App Backend Running ✅");
});

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Donation routes (Add, Get, Edit, Delete)
const donationRoutes = require("./routes/donationRoutes");
app.use("/api/donations", donationRoutes);

// Dashboard statistics routes
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// Report routes (Recent donations, Export to Excel)
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/report", reportRoutes);

// --- Database Connection & Server Start ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();
