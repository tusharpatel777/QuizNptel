const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');

// Get all available quiz weeks
exports.getQuizWeeks = async (req, res) => {
  try {
    const weeks = await Question.distinct('week').sort();
    res.json(weeks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get questions for a specific week (shuffled and without correct answers for the live quiz)
exports.getQuestionsByWeek = async (req, res) => {
  try {
    const { week } = req.params;
    // IMPORTANT: .select('-correctAnswer') ensures correct answers are NOT sent to the client
    const questions = await Question.find({ week }).select('-correctAnswer -__v').lean(); 
    // .lean() makes the documents plain JS objects for better performance
    
    // Optionally shuffle questions
    // questions.sort(() => Math.random() - 0.5); 

    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Submit quiz and calculate score
exports.submitQuiz = async (req, res) => {
  const { week, answers, timeTaken } = req.body;
  // const userId = req.user ? req.user.id : null; // Uncomment if using authentication

  try {
    let score = 0;
    const totalQuestions = answers.length;
    const quizAnswers = []; // To store formatted answers for the QuizAttempt document

    // Fetch all original questions by their IDs to verify answers securely on the backend
    const questionIds = answers.map(a => a.questionId);
    const originalQuestions = await Question.find({ '_id': { $in: questionIds } });
    const questionMap = originalQuestions.reduce((map, q) => {
      map[q._id.toString()] = q;
      return map;
    }, {});

    for (const submittedAnswer of answers) {
      const question = questionMap[submittedAnswer.questionId];

      if (question) {
        const isCorrect = question.correctAnswer === submittedAnswer.selectedAnswer;
        if (isCorrect) {
          score += question.points;
        }
        quizAnswers.push({
          questionId: question._id,
          selectedAnswer: submittedAnswer.selectedAnswer || null, // Store null if no answer selected
          isCorrect: isCorrect,
        });
      } else {
        // Handle case where a question ID might be invalid (e.g., store as incorrect)
        quizAnswers.push({
          questionId: submittedAnswer.questionId,
          selectedAnswer: submittedAnswer.selectedAnswer || null,
          isCorrect: false,
        });
      }
    }

    const quizAttempt = new QuizAttempt({
      // user: userId, // Uncomment if using authentication
      week,
      score,
      totalQuestions,
      answers: quizAnswers,
      timeTaken,
    });

    await quizAttempt.save();
    res.json({ message: 'Quiz submitted successfully', score, quizAttemptId: quizAttempt._id });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get a single quiz attempt by ID
exports.getQuizAttemptById = async (req, res) => {
    try {
        const attempt = await QuizAttempt.findById(req.params.quizAttemptId).lean();
        if (!attempt) {
            return res.status(404).json({ msg: 'Quiz attempt not found' });
        }
        res.json(attempt);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get full question details (including correct answer) by a list of IDs for results review
exports.getFullQuestionsByIds = async (req, res) => {
  try {
    const { questionIds } = req.body;
    // Explicitly include all fields for detailed results display
    const questions = await Question.find({ '_id': { $in: questionIds } }).select('-__v').lean();
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Optional: Get user's quiz attempts for a specific week (requires authentication)
exports.getQuizAttemptsByWeek = async (req, res) => {
  // if (!req.user) { // Example authentication check
  //   return res.status(401).json({ msg: 'Not authorized' });
  // }
  try {
    const { week } = req.params;
    // const userId = req.user.id; // Requires authentication
    const attempts = await QuizAttempt.find({ /*user: userId,*/ week }).sort({ submittedAt: -1 }).lean();
    res.json(attempts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};