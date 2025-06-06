const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, text: true },
    species: { type: String, required: true },
    breed: { type: String, required: true, text: true },
    age: { type: Number, required: true },
    description: { type: String },
    photo: { type: String }, // URL or filename
    status: {
      type: String,
      enum: ["Available", "Adopted", "Pending"],
      default: "Available",
    },
  },
  { timestamps: true }
);

// Text index for search
petSchema.index({ name: "text", breed: "text" });

module.exports = mongoose.model("Pet", petSchema);
