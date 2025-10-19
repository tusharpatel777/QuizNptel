const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
// const auth = require('../middleware/auth'); // If authentication is used

// Public routes for quiz list and questions (without correct answers)
router.get('/weeks', quizController.getQuizWeeks);
router.get('/:week/questions', quizController.getQuestionsByWeek);

// Routes requiring specific data or to save attempts
router.post('/submit', quizController.submitQuiz); 
router.get('/attempts/:quizAttemptId', quizController.getQuizAttemptById); // Get specific attempt results
router.post('/questions-by-ids', quizController.getFullQuestionsByIds); // Get full question data by IDs

// Optional: Route for user's past attempts (requires authentication)
router.get('/:week/attempts', /*auth,*/ quizController.getQuizAttemptsByWeek); 

module.exports = router;