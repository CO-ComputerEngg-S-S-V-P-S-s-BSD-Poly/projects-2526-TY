const express = require("express");
const {
  postNeedRoom,
  getAllNeedFlatmatePosts,
  getNeedFlatmateNotifications,
  matchNeedFlatmate
} = require("../controllers/needRoomController"); // ✅ Ensure these match exactly

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Post a Need Room Request
router.post("/", authMiddleware, postNeedRoom);

// ✅ Get all NeedFlatmate posts
router.get("/need-flatmate-posts", authMiddleware, getAllNeedFlatmatePosts);

// ✅ Get NeedFlatmate Notifications for NeedRoom users
router.get("/notifications", authMiddleware, getNeedFlatmateNotifications);

// ✅ Match NeedRoom with NeedFlatmate
router.post("/match-need-flatmate", authMiddleware, matchNeedFlatmate);

module.exports = router;
