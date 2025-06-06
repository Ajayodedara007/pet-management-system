const express = require("express");
const router = express.Router();
const {
  applyForAdoption,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} = require("../controllers/adoptionController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// User Routes
router.post("/apply/:petId", protect, applyForAdoption);
router.get("/my", protect, getMyApplications);

// Admin Routes
router.get("/", protect, adminOnly, getAllApplications);
router.put("/:id", protect, adminOnly, updateApplicationStatus);

module.exports = router;
