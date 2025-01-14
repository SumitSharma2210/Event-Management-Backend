const express = require("express");
const {
  registerUser,
  loginUser,
  guestLogin,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/guestLogin", guestLogin);

module.exports = router;
