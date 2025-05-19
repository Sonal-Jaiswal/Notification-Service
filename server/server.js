require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const notificationRoutes = require('./routes/notificationRoutes');
const { connectQueue } = require('./queues/notificationQueue');

const app = express();
app.use(express.json());
app.use('/api', notificationRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("Mongo error", err));

connectQueue();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));