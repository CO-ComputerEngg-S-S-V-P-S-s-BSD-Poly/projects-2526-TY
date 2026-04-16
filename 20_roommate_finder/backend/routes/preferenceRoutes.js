const express = require("express");
const { postPreference, getPreferences, matchNeedRoom, matchNeedFlatmate } = require("../controllers/preferencesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, postPreference);
router.get("/", authMiddleware, getPreferences);
router.get("/match-need-room", authMiddleware, matchNeedRoom);
router.get("/match-need-flatemate", authMiddleware, matchNeedFlatmate);

module.exports = router;
