// controllers/reportController.js
const Donation = require("../models/donation");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const getRecentDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 }).limit(10);
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};

// ✅ THIS IS SERVER-SIDE LOGIC
const exportToExcel = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });

    const data = donations.map((d) => ({
      Date: new Date(d.createdAt).toLocaleDateString(),
      Name: d.fullName,
      Amount: d.amount,
      Mode: d.paymentMode,
      Mobile: d.mobileNumber,
      UTR: d.upiUtrNumber || "",
      Address: d.address,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");

    // Save temporarily to server
    const filePath = path.join(__dirname, "../exports/donations.xlsx");
    XLSX.writeFile(workbook, filePath);

    // Send file as download
    res.download(filePath, "mandal_donations.xlsx", (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ message: "Failed to download file" });
      }

      // Optional: Delete the file after sending
      fs.unlink(filePath, () => {});
    });
  } catch (err) {
    console.error("Export Error:", err);
    res
      .status(500)
      .json({ message: "Failed to export Excel", error: err.message });
  }
};

module.exports = { getRecentDonations, exportToExcel };
