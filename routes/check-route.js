const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.user) {
    return res.status(200).json({ isAuthenticated: true, user: req.user });
  }
  return res.status(401).json({ isAuthenticated: false });
});

module.exports = router;
