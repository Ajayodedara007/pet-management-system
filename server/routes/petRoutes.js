const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
} = require("../controllers/petController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllPets);
router.get("/:id", getPetById);

// Admin protected routes
router.post("/", protect, adminOnly, upload.single("photo"), createPet);
router.put("/:id", protect, adminOnly, upload.single("photo"), updatePet);
router.delete("/:id", protect, adminOnly, deletePet);

module.exports = router;
