const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer"],
      required: true,
    },
    upiUtrNumber: {
      type: String,
      default: "", // Optional field
    },
    address: {
      type: String,
      default: "",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
