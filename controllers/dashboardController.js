const Donation = require("../models/donation");

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Promise.all([
      // Total collection
      Donation.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      // Total donation entries (not unique mobile numbers)
      Donation.countDocuments(),
      // Today's collection
      Donation.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      // Today's donation entries
      Donation.countDocuments({ createdAt: { $gte: today } }),
    ]);

    const totalCollection = stats[0][0]?.total || 0;
    const totalDonors = stats[1] || 0;
    const todayCollection = stats[2][0]?.total || 0;
    const todayDonors = stats[3] || 0;

    res.json({
      totalCollection,
      totalDonors,
      todayCollection,
      todayDonors,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res
      .status(500)
      .json({ message: "Dashboard stats failed", error: err.message });
  }
};

module.exports = { getDashboardStats };
