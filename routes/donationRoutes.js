const express = require("express");
const router = express.Router();

const {
  addDonation,
  getAllDonations,
  deleteDonation,
  updateDonation,
} = require("../controllers/donationController");

const { requireAuth } = require("../middleware/auth");

// ➕ Add a new donation
router.post("/add", requireAuth, addDonation);

// 📥 Get all donations
router.get("/", requireAuth, getAllDonations);

// 🗑 Delete a donation by ID
router.delete("/:id", requireAuth, deleteDonation);

// ✏️ Update a donation by ID
router.put("/:id", requireAuth, updateDonation);

module.exports = router;
