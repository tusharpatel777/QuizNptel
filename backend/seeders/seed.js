
// require('dotenv').config({ path: '../.env' }); // Adjust path as necessary for your setup
// const mongoose = require('mongoose');
// const connectDB = require('../config/db');
// const Question = require('../models/Question');
// const questionsData = require('./questions'); // Your extracted questions

// connectDB(); // Establish MongoDB connection

// const seedDB = async () => {
//   try {
//     console.log('Clearing existing questions...');
//     await Question.deleteMany({}); // Clear existing questions to avoid duplicates
//     console.log('Existing questions cleared. Inserting new questions...');
//     await Question.insertMany(questionsData); // Insert all questions from questions.js
//     console.log('Questions seeded successfully!');
//     process.exit(); // Exit the script gracefully
//   } catch (err) {
//     console.error('Error seeding database:', err);
//     process.exit(1); // Exit with an error code
//   }
// };

// seedDB();
// C:\Users\Tushar Patel\quiz-app\backend\seeders\seed.js
// require('dotenv').config({ path: '../.env' }); // Path for .env file in parent 'backend' folder

// --- DEBUGGING LINE ADDED HERE ---
// const 
// console.log('DEBUG: MONGO_URI in process.env:', process.env.MONGO_URI);
// --- END DEBUGGING LINE ---
require('dotenv').config()
const mongoose = require('mongoose');
const connectDB = require('../config/db'); // This correctly points to backend/config/db.js
const Question = require('../models/Question');
const questionsData = require('./questions'); // This correctly points to backend/seeders/questions.js

// Note: We call connectDB directly here to establish MongoDB connection for the seed process
// and rely on the dotenv.config() above to load the MONGO_URI
connectDB();

const seedDB = async () => {
  // Check if MONGO_URI was loaded before proceeding
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('your_mongodb_connection_string_here')) {
      console.error('ERROR: MONGO_URI is not set or is still the placeholder in your .env file!');
      console.error('Please ensure your .env file is correctly configured in C:\\Users\\Tushar Patel\\quiz-app\\backend\\');
      process.exit(1);
  }

  try {
    console.log('Clearing existing questions...');
    await Question.deleteMany({}); // Clear existing questions to avoid duplicates
    console.log('Existing questions cleared. Inserting new questions...');
    await Question.insertMany(questionsData); // Insert all questions from questions.js
    console.log('Questions seeded successfully!');
    process.exit(); // Exit the script gracefully
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1); // Exit with an error code
  }
};

seedDB();