const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const multer = require("multer");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const app = express();
const Moto = require("./models/motorbike");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB :)"))
  .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "layout");

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

//para poder subir hasta 10 imagenes por moto
const upload = multer({ storage: storage }).array("images", 10);
module.exports = upload;

// Routes
const motorbikesRouter = require("./routes/motorbikes")(upload);
app.use("/motorbikes", motorbikesRouter);

// Home route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/motorbikes", async (req, res) => {
  try {
    const motorbikes = await Moto.find(); // Fetch motorbikes from DB
    res.render("all", { title: "All motorbikes", motorbikes }); // Pass motorbikes to view
    console.log(motorbikes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
// Routes
// Home route
app.get("/backend", async (req, res) => {
  try {
    const motorbikes = await Moto.find();
    res.render("backend", { title: "Backend", motorbikes }); // Pass motorbikes to admin page
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
