const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// --- Configuration ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// --- Middleware ---
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// --- Routes ---
// Root health check
app.get("/", (req, res) => {
  res.send("Mandal Donation App Backend Running ✅");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/report", require("./routes/reportRoutes"));

// --- Database Connection & Server Start ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();
