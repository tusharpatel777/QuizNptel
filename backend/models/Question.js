const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
  },
  questionNumber: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // Array of strings for options
    required: true,
  },
  correctAnswer: {
    type: String, // The correct option string
    required: true,
  },
  points: {
    type: Number,
    default: 1, // Default points for each question
  },
  imageUrl: { // Optional: for questions that refer to an image
    type: String,
  }
});

module.exports = mongoose.model('Question', QuestionSchema);


