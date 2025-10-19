import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaCheck, FaPlay } from "react-icons/fa";
import { getQuestionsByWeek, submitQuiz } from "../api/quizApi";
import Timer from "../components/Timer";

const QuizPage = () => {
  const { week } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestionsByWeek(week);
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError("⚠️ Failed to load questions. Please check your backend server.");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [week]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeTaken(0);
  };

  const handleOptionChange = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0)
      setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleTimerUpdate = useCallback((newTime) => {
    setTimeTaken(newTime);
  }, []);

  const handleSubmitQuiz = async () => {
    setQuizStarted(false);
    const confirmSubmit = window.confirm("Do you want to submit the quiz?");
    if (!confirmSubmit) {
      setQuizStarted(true);
      return;
    }

    const formattedAnswers = questions.map((q) => ({
      questionId: q._id,
      selectedAnswer: selectedAnswers[q._id] || null,
    }));

    try {
      const response = await submitQuiz(parseInt(week), formattedAnswers, timeTaken);
      navigate(`/results/${response.quizAttemptId}`);
    } catch (err) {
      setError("❌ Failed to submit quiz. Please try again.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0a1f] via-[#101030] to-[#000000]">
        <p className="text-2xl text-gray-300 font-semibold animate-pulse">
          Loading quiz...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0a1f] via-[#101030] to-[#000000]">
        <p className="text-lg text-red-500 font-medium bg-[#1a1a2e] p-4 rounded-xl shadow-md">
          {error}
        </p>
      </div>
    );

  if (questions.length === 0)
    return (
      <div className="text-center mt-20 text-lg text-gray-400">
        No questions available for Week {week}.
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen w-[100vw] bg-gradient-to-b from-[#0a0a1f] via-[#101030] to-[#000000] py-12 px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-16 right-10 w-36 h-36 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse delay-200"></div>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto bg-[#121229] shadow-2xl rounded-3xl p-10 border border-[#1f1f3f] relative z-10">
        <h2 className="text-4xl font-extrabold text-yellow-300 text-center mb-6 tracking-tight">
          Organizational Behaviour Quiz - Week {week}
        </h2>

        {!quizStarted ? (
          <div className="text-center py-10">
            <p className="text-lg text-blue-300 mb-8">
              Get ready to test your knowledge for <b>Week {week}</b>. Focus and do your best!
            </p>
            <button
              onClick={handleStartQuiz}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <FaPlay /> Start Quiz
            </button>
          </div>
        ) : (
          <>
            {/* Question Header */}
            <div className="flex justify-between items-center mb-6 text-gray-300">
              <div className="text-xl font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="text-lg font-semibold text-blue-400">
                <Timer
                  isRunning={quizStarted}
                  onTimeUpdate={handleTimerUpdate}
                  initialTime={timeTaken}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="mb-8 p-8 border border-[#1f1f3f] rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#121229] shadow-inner">
              <p className="text-lg font-medium text-gray-200 mb-4 leading-relaxed">
                {currentQuestion.text}
              </p>

              {currentQuestion.imageUrl && (
                <img
                  src={currentQuestion.imageUrl}
                  alt="Question"
                  className="my-4 max-w-full h-auto rounded-xl shadow-md mx-auto border border-[#2a2a3f]"
                />
              )}

              <div className="space-y-4 mt-4">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                      selectedAnswers[currentQuestion._id] === option
                        ? "bg-blue-700 border-blue-400 text-white"
                        : "border-[#2a2a3f] hover:bg-[#2a2a50] text-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion._id}`}
                      value={option}
                      checked={selectedAnswers[currentQuestion._id] === option}
                      onChange={() => handleOptionChange(currentQuestion._id, option)}
                      className="form-radio h-5 w-5 text-blue-400 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-base">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center gap-2 py-2 px-5 rounded-full font-semibold shadow-md transition-all duration-300 ${
                  currentQuestionIndex === 0
                    ? "bg-gray-600 cursor-not-allowed text-gray-300"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <FaArrowLeft /> Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 py-2 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all duration-300"
                >
                  Next <FaArrowRight />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="flex items-center gap-2 py-2 px-5 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition-all duration-300"
                >
                  Submit <FaCheck />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPage;

