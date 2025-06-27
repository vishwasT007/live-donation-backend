const Donation = require("../models/Donation");
const { sendSMS } = require("../services/sms");

// ➕ Add Donation
const addDonation = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      amount,
      paymentMode,
      address,
      upiUtrNumber, // ✅ new field
    } = req.body;

    if (!fullName || !mobileNumber || !amount || !paymentMode) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const donation = await Donation.create({
      fullName,
      mobileNumber,
      amount,
      paymentMode,
      address,
      upiUtrNumber, // ✅ add to database
      addedBy: req.user.userId,
    });

    // ✅ Send SMS
    await sendSMS(fullName, amount, mobileNumber);

    res.status(201).json({ message: "Donation added", donation });
  } catch (err) {
    console.error("Error in addDonation:", err);
    res
      .status(500)
      .json({ message: "Error adding donation", error: err.message });
  }
};

// 📥 Get All Donations
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get donations", error: err.message });
  }
};

// 🗑 Delete Donation
const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.json({ message: "Donation deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting donation", error: err.message });
  }
};

// ✏️ Update Donation
const updateDonation = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      amount,
      paymentMode,
      address,
      upiUtrNumber,
    } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        mobileNumber,
        amount,
        paymentMode,
        address,
        upiUtrNumber,
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json({ message: "Donation updated successfully", donation });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating donation", error: err.message });
  }
};

module.exports = {
  addDonation,
  getAllDonations,
  deleteDonation,
  updateDonation,
};
