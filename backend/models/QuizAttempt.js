const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  // user: { // Uncomment and use if implementing user authentication
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true, // Make true if users are mandatory
  // },
  week: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  answers: [ // Array to store each question's details in this attempt
    {
      questionId: { // Reference to the original Question
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
      selectedAnswer: { // The option chosen by the user
        type: String,
        default: null, // If user didn't select an answer
      },
      isCorrect: { // Whether the selected answer was correct
        type: Boolean,
        required: true,
      },
    },
  ],
  timeTaken: { // Time in seconds
    type: Number,
    default: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);