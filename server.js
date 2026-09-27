const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('.'));

// 1. Database Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:zesta123@cluster0.mongodb.net/zestaDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI,{dbName:'zestaDB'})
    .then(() => {console.log('MongoDB Connected Successfully');})
    .catch((err) => {console.log('DB Connection Error:', err);});

// 2. Data Schemas
const OrderSchema = new mongoose.Schema({
    name: String,
    email: String,
    quantity: Number,
    flavor: String,
    createdAt: { type: Date, default: Date.now }
});

const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);
const Contact = mongoose.model('Contact', ContactSchema);

// 3. API Routes

// Order API (POST)
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get All Orders API (GET for Judges Demo)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, count: orders.length, orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Contact API (POST)
app.post('/api/contact', async (req, res) => {
    try {
        const newMessage = new Contact(req.body);
        await newMessage.save();
        res.status(201).json({ success: true, message: "Message received!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));