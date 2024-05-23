const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const expressLayouts = require("express-ejs-layouts"); // Correctly import express-ejs-layouts
require("dotenv").config();
const app = express();
const Moto = require("./models/motorbike"); // Ensure correct path to motorbike model
const rutasMoto = require("./routes/motorbikes");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB :)");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", rutasMoto);
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts); // Use express-ejs-layouts
app.set("view engine", "ejs");
app.set("layout", "layout"); // Set default layout

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileType = file.mimetype.split("/")[0];
    let uploadPath = "public/uploads";
    if (fileType === "image") {
      uploadPath = "public/images";
    } else if (fileType === "video") {
      uploadPath = "public/videos";
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// Routes
const motorbikesRouter = require("./routes/motorbikes");
app.use("/motorbikes", motorbikesRouter(upload));

// Home route - Fetch and render motorbikes
app.get("/", (req, res) => {
  //Render index
  res.render("index", { title: "Home" }); // Pass motorbikes to view
});

app.get("/landing", async (req, res) => {
  try {
    const motorbikes = await Moto.find(); // Fetch motorbikes from DB
    res.render("all", { title: "All motorbikes", motorbikes }); // Pass motorbikes to view
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
// Routes
app.get("/new", (req, res) => {
  try {
    res.render("new", { title: "New Motorbike" }); // Pass motorbikes to view
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/edit", async (req, res) => {
  try {
    const motorbikes = await Moto.find(); 
    res.render("edit", { title: "Edit Motorbike" , motorbikes}); // Pass motorbikes to view
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
