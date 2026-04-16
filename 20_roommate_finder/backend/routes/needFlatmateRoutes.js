const express = require("express");
const { 
  postNeedFlatmate, 
  getAllNeedRoomPosts, 
  getNeedRoomNotifications, 
  matchNeedRoom 
} = require("../controllers/needFlatmateController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ✅ Post "Need a Flatmate" Requirement (Now handles image upload)
router.post("/", authMiddleware, upload.single("flatPic"), postNeedFlatmate);

// ✅ Get All "Need a Room" Posts
router.get("/need-room-posts", authMiddleware, getAllNeedRoomPosts);

// ✅ Get Notifications for "Need a Flatmate" Posts
router.get("/notifications", authMiddleware, getNeedRoomNotifications);

// ✅ Match "Need a Room" with "Need a Flatmate"
router.post("/match-need-room", authMiddleware, matchNeedRoom);

module.exports = router;
