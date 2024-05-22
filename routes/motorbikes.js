const express = require('express');
const Moto = require('../models/motorbike'); 
const router = express.Router();

module.exports = (upload) => {

    // Display all motorbikes
    router.get('/', async (req, res) => {
        try {
            const response = await axios.get('API_URL'); // Replace with actual API URL
            const motorbikes = response.data;
    
            console.log('Motorbikes from API:', motorbikes); // Ensure this logs correctly
            res.render('index', { motorbikes }); // Pass motorbikes to view
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });


    // Show form to add new motorbike
    router.get('/new', (req, res) => {
        res.render('new');
    });

    // Handle new motorbike creation
    router.post('/', upload.single('image'), async (req, res) => {
        try {
            const { brand, model, year, engineType, horsepower, torque, weight, topSpeed, color, price } = req.body;
            const image = req.file ? req.file.filename : '';
            const newMotorbike = new Moto({ brand, model, year, engineType, horsepower, torque, weight, topSpeed, color, price, image });
            await newMotorbike.save();
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // Show form to edit a motorbike
    router.get('/:id/edit', async (req, res) => {
        try {
            const motorbike = await Moto.findById(req.params.id);
            res.render('edit', { motorbike });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // Handle motorbike update
    router.put('/:id', upload.single('image'), async (req, res) => {
        try {
            const { brand, model, year, engineType, horsepower, torque, weight, topSpeed, color, price } = req.body;
            const motorbike = await Moto.findById(req.params.id);

            if (!motorbike) {
                return res.status(404).json({ message: 'Motorbike not found' });
            }

            if (req.file) {
                motorbike.image = req.file.filename;
            }

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
            res.redirect('/motorbikes');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });


    // Handle motorbike delete
    router.delete('/:id', async (req, res) => {
        try {
            await Moto.findByIdAndRemove(req.params.id);
            res.redirect('/motorbikes');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    return router;
};
