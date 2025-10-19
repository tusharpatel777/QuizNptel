require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors()); // Allow cross-origin requests from your frontend
app.use(express.json()); // Allows us to get data in req.body

// Define Routes
app.use('/api/quizzes', quizRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));