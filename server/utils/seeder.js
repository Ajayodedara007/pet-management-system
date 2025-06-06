const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function seedAdminUser() {
  const adminEmail = "admin@gmail.com";

  const existing = await User.findOne({ email: adminEmail });
  if (existing) return;

  const hashed = await bcrypt.hash("admin123", 10);
  await User.create({
    name: "Admin",
    email: adminEmail,
    password: hashed,
    role: "admin",
  });

  console.log("Admin user email and password: admin@gmail.com / admin123");
}

module.exports = seedAdminUser;
