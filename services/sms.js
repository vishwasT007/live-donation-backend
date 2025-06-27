const axios = require("axios");

const sendSMS = async (name, amount, mobile) => {
  const message = `🙏 Thank you ${name} for donating ₹${amount} to Shree Ram Ganj Bazar Sarvjanik Ganesh Utsav Mandal, Tirora. Your support is appreciated!`;

  try {
    const res = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message,
        language: "english",
        numbers: mobile,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
        },
      }
    );
    console.log("SMS sent:", res.data.return);
  } catch (err) {
    console.error("SMS failed:", err.response?.data || err.message);
  }
};

module.exports = { sendSMS };
