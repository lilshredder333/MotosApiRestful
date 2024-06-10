const express = require("express");
const Moto = require("../models/motorbike");
const router = express.Router();
const axios = require("axios");

module.exports = (upload) => {
  // Display all motorbikes
  router.get("/motorbikes", async (req, res) => {
    try {
      const motorbikes = await Moto.find();
      res.render("index", { motorbikes });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

  // Show form to add new motorbike
  router.get("/new", (req, res) => {
    res.render("new");
  });

  // Handle new motorbike creation
  router.post("/", upload, async (req, res) => {
    try {
      const {
        brand,
        model,
        year,
        engineType,
        horsepower,
        torque,
        weight,
        topSpeed,
        color,
        price,
      } = req.body;
      const images = req.files.map((file) => file.filename);
      const newMotorbike = new Moto({
        brand,
        model,
        year,
        engineType,
        horsepower,
        torque,
        weight,
        topSpeed,
        color,
        price,
        images,
      });
      await newMotorbike.save();
      res.redirect("/motorbikes");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

  // Show form to edit a motorbike
  router.get("/:id/edit", async (req, res) => {
    try {
      const motorbike = await Moto.findById(req.params.id);
      res.render("edit", { motorbike });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

  // Handle motorbike update
  // Handle motorbike update
  router.put("/:id", upload, async (req, res) => {
    try {
      const {
        brand,
        model,
        year,
        engineType,
        horsepower,
        torque,
        weight,
        topSpeed,
        color,
        price,
      } = req.body;

      const motorbike = await Moto.findById(req.params.id);

      if (!motorbike) {
        return res.status(404).json({ message: "Motorbike not found" });
      }

      // Check if new files are uploaded
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => `/uploads/${file.filename}`);
        motorbike.images = motorbike.images.concat(newImages);
      }

      // Update the motorbike details
      motorbike.brand = brand;
      motorbike.model = model;
      motorbike.year = year;
      motorbike.engineType = engineType;
      motorbike.horsepower = horsepower;
      motorbike.torque = torque;
      motorbike.weight = weight;
      motorbike.topSpeed = topSpeed;
      motorbike.color = color;
      motorbike.price = price;

      await motorbike.save();
      res.redirect("/motorbikes");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

  // Handle motorbike delete
  router.delete("/:id", async (req, res) => {
    try {
      const motorbike = await Moto.findByIdAndDelete(req.params.id);

      if (!motorbike) {
        return res.status(404).json({ message: "Motorbike not found" });
      }

      res.redirect("/motorbikes");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

  return router;
};
