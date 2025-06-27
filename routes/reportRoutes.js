const express = require("express");
const router = express.Router();
const {
  getRecentDonations,
  exportToExcel,
} = require("../controllers/reportController");
const { requireAuth } = require("../middleware/auth");

router.get("/recent", requireAuth, getRecentDonations);
router.get("/export", requireAuth, exportToExcel);

module.exports = router;
