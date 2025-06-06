const Adoption = require("../models/Adoption");
const Pet = require("../models/Pet");

exports.applyForAdoption = async (req, res) => {
  try {
    const existing = await Adoption.findOne({
      user: req.user.id,
      pet: req.params.petId,
    });

    if (existing)
      return res.status(400).json({ message: "Already applied for this pet." });

    const pet = await Pet.findById(req.params.petId);
    if (!pet || pet.status !== "Available")
      return res.status(400).json({ message: "Pet not available." });

    const adoption = await Adoption.create({
      user: req.user.id,
      pet: req.params.petId,
      message: req.body.message || "",
    });

    res.status(200).json(adoption);
  } catch (err) {
    res.status(500).json({ message: "Error applying for adoption." });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Adoption.find({ user: req.user.id }).populate(
      "pet"
    );
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications." });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Adoption.find().populate("user").populate("pet");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all applications." });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const adoption = await Adoption.findById(req.params.id).populate("pet");

    if (!adoption) return res.status(404).json({ message: "Not found" });

    adoption.status = status;
    await adoption.save();

    if (status === "Approved") {
      adoption.pet.status = "Adopted";
      await adoption.pet.save();
    }

    res.json(adoption);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
};
