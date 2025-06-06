const Pet = require("../models/Pet");

exports.createPet = async (req, res) => {
  try {
    const petData = req.body;
    if (req.file) petData.photo = `/uploads/${req.file.filename}`;

    const pet = await Pet.create(petData);
    res.status(200).json(pet);
  } catch (err) {
    console.error("Error creating pet:", err);
    res.status(500).json({ message: "Error creating pet" });
  }
};

exports.getAllPets = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit;

    const totalPets = await Pet.countDocuments({});
    const totalPages = Math.ceil(totalPets / limit);

    const pets = await Pet.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      pets,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (err) {
    console.error("Error fetching pet:", err);
    res.status(500).json({ message: "Error fetching pet" });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) updates.photo = `/uploads/${req.file.filename}`;

    const pet = await Pet.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    res.status(200).json(pet);
  } catch (err) {
    console.error("Error updating pet:", err);
    res.status(500).json({ message: "Error updating pet" });
  }
};

exports.deletePet = async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Pet deleted" });
  } catch (err) {
    console.error("Error deleting pet:", err);
    res.status(500).json({ message: "Error deleting pet" });
  }
};
