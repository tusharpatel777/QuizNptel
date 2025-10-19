import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getQuizAttemptById, getFullQuestionsByIds } from "../api/quizApi";

const ResultsPage = () => {
  const { quizAttemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const attemptData = await getQuizAttemptById(quizAttemptId);
        setAttempt(attemptData);

        const questionIds = attemptData.answers.map((ans) => ans.questionId);
        const fullQuestionsData = await getFullQuestionsByIds(questionIds);

        const questionsMap = fullQuestionsData.reduce((acc, q) => {
          acc[q._id] = q;
          return acc;
        }, {});
        setQuestions(questionsMap);
        setLoading(false);
      } catch (err) {
        setError(
          "⚠️ Failed to load quiz results. Please ensure backend is running and the quiz attempt ID is valid."
        );
        console.error(err);
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizAttemptId]);

  const formatTime = (totalSeconds) => {
    if (typeof totalSeconds !== "number" || isNaN(totalSeconds) || totalSeconds < 0) {
      return "00:00";
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0a1f] via-[#101030] to-[#000000]">
        <p className="text-2xl text-gray-300 font-semibold animate-pulse">
          Loading results...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0a1f] via-[#101030] to-[#000000]">
        <p className="text-lg text-red-500 font-medium bg-[#1a1a2f] p-4 rounded-xl shadow-md border border-red-700">
          {error}
        </p>
      </div>
    );

  if (!attempt)
    return (
      <div className="text-center mt-8 text-lg text-gray-300">
        No results found for this attempt.
      </div>
    );

  const totalPossibleScore = attempt.answers.reduce((sum, answer) => {
    const originalQuestion = questions[answer.questionId];
    return sum + (originalQuestion ? originalQuestion.points : 1);
  }, 0);

  return (
    <div className="w-[100vw] min-h-screen bg-gradient-to-b from-[#0a0a1f] via-[#101030] to-[#000000] py-12 px-6 relative overflow-hidden">
      {/* Decorative Glowing Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-16 right-10 w-36 h-36 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-200"></div>

      <div className="max-w-5xl mx-auto bg-[#1a1a2f] bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-3xl p-10 border border-[#2a2a4f] relative z-10">
        <h2 className="text-4xl font-extrabold text-blue-300 text-center mb-8 tracking-tight">
          🏆 Results - Week {attempt.week}
        </h2>

        {/* Summary Card */}
        <div className="mb-10 text-center bg-gradient-to-r from-[#101030] via-[#121240] to-[#101030] p-8 rounded-2xl shadow-inner border border-[#2a2a4f]">
          <p className="text-2xl font-bold text-green-400 mb-3">
            Score: {attempt.score} / {totalPossibleScore}
          </p>
          <p className="text-gray-300 text-lg">
            ✅ Correct Answers:{" "}
            <span className="font-semibold text-green-500">
              {attempt.answers.filter((a) => a.isCorrect).length}
            </span>{" "}
            / {attempt.totalQuestions}
          </p>
          <p className="text-gray-300 text-lg mt-2">
            ⏱️ Time Taken:{" "}
            <span className="font-medium text-blue-300">
              {formatTime(attempt.timeTaken)}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            📅 Submitted on: {new Date(attempt.submittedAt).toLocaleString()}
          </p>
        </div>

        {/* Detailed Answers */}
        <h3 className="text-2xl font-bold text-blue-300 mb-6 border-b border-blue-600 pb-2">
          Detailed Breakdown
        </h3>

        <div className="space-y-6">
          {attempt.answers.map((answer, index) => {
            const originalQuestion = questions[answer.questionId];
            if (!originalQuestion) {
              return (
                <div
                  key={index}
                  className="p-5 border border-yellow-600 bg-yellow-900 rounded-2xl shadow-sm"
                >
                  <p className="text-lg font-semibold text-yellow-400">
                    Q{index + 1}: Question data missing.
                  </p>
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`p-6 rounded-2xl shadow-md transition-all duration-300 border-l-8 ${
                  answer.isCorrect
                    ? "bg-green-900 border-green-500"
                    : "bg-red-900 border-red-500"
                }`}
              >
                <p className="text-lg font-semibold text-gray-200 mb-3">
                  Q{index + 1}: {originalQuestion.text}{" "}
                  <span className="text-sm text-gray-400">
                    (Points: {originalQuestion.points})
                  </span>
                </p>

                {originalQuestion.imageUrl && (
                  <img
                    src={originalQuestion.imageUrl}
                    alt="Question related"
                    className="my-4 w-full max-w-md mx-auto rounded-lg shadow-md"
                  />
                )}

                <ul className="ml-5 list-disc space-y-2">
                  {originalQuestion.options.map((option, i) => (
                    <li
                      key={i}
                      className={`transition-colors ${
                        option === originalQuestion.correctAnswer
                          ? "font-bold text-green-400"
                          : "text-gray-300"
                      } ${
                        option === answer.selectedAnswer &&
                        !answer.isCorrect &&
                        "text-red-400 italic"
                      }`}
                    >
                      {option}
                      {option === originalQuestion.correctAnswer && " ✅ (Correct)"}
                      {option === answer.selectedAnswer &&
                        !answer.isCorrect &&
                        " ❌ (Your Answer)"}
                    </li>
                  ))}
                </ul>

                <p
                  className={`mt-4 font-semibold ${
                    answer.isCorrect ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {answer.isCorrect
                    ? "✔ You answered correctly!"
                    : "✖ You answered incorrectly."}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
         <Link
  to="/quizzes"
  className="relative inline-block px-8 py-3 font-medium text-white group focus:outline-none focus:ring"
>
  <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-gradient-to-r from-purple-600 to-blue-500 group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-xl"></span>
  <span className="absolute inset-0 w-full h-full bg-[#12122e] border-2 border-purple-500 rounded-xl"></span>
  <span className="relative">🔙 Back to Quiz Weeks</span>
</Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
