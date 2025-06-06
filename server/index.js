const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const seedAdminUser = require("./utils/seeder");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes.js"));
app.use("/api/pets", require("./routes/petRoutes"));
app.use("/api/adoption", require("./routes/adoptionRoutes"));

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await seedAdminUser();
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));
