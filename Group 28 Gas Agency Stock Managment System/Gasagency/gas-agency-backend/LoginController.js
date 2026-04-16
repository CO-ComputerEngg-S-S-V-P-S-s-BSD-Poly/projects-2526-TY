const User = require("./LoginModel");

const login = async (req, res) => {
  const { username, password, loginType, staffType } = req.body;

  try {
    const query = { username, password, type: loginType };
    if (loginType === "Staff") query.staffType = staffType;

    const user = await User.findOne(query);

    if (user) {
      return res.json({
        success: true,
        user: {
          username: user.username,
          type: user.type,
          staffType: user.staffType || null
        }
      });
    } else {
      return res.json({ success: false, message: "Invalid username/password or type!" });
    }
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { login };