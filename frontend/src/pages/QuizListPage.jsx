import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getQuizWeeks } from "../api/quizApi";
import { FaCalendarWeek } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { MdQuiz } from "react-icons/md";

const QuizListPage = () => {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        const data = await getQuizWeeks();
        setWeeks(data.sort((a, b) => a - b));
        setLoading(false);
      } catch (err) {
        setError("Failed to load quiz weeks. Please check your backend server.");
        setLoading(false);
      }
    };
    fetchWeeks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-gray-300">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-500 mb-4"></div>
        <p className="text-lg font-medium">Loading quiz weeks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-300">
        <p className="text-red-500 text-lg font-semibold mb-3">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg shadow-md transition duration-300"
        >
          <IoReload className="text-xl" />
          Retry
        </button>
      </div>
    );
  }

  if (weeks.length === 0) {
    return (
      <div className="text-center text-gray-400 text-lg mt-20">
        No quizzes available yet. <br /> Please contact the admin or check back later.
      </div>
    );
  }

  return (
    <div className="w-[90vw] mx-auto bg-gradient-to-b from-[#0a0a1f] via-[#101030] to-[#000000] shadow-xl rounded-2xl p-8 mt-10">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-3">
          <MdQuiz className="text-blue-400 text-5xl" />
        </div>
        <h2 className="text-4xl font-extrabold text-blue-400 mb-2 tracking-tight">
          Weekly Quiz Zone
        </h2>
        <p className="text-gray-400 text-lg">
          Choose a week below to start your quiz and test your knowledge!
        </p>
      </div>

      {/* Grid of Weeks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {weeks.map((weekNum) => (
          <Link
            key={weekNum}
            to={`/quiz/${weekNum}`}
            className="group relative bg-[#1a1a2e] border border-[#2a2a3f] rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 p-6 flex flex-col items-center text-center"
          >
            <div className="bg-[#2a2a3f] p-4 rounded-full mb-4 group-hover:bg-blue-500 transition-all duration-300">
              <FaCalendarWeek className="text-blue-400 text-3xl group-hover:text-white transition-all duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-blue-300 group-hover:text-blue-400">
              Week {weekNum}
            </h3>
            <p className="text-gray-400 mt-2 text-sm">
              Click to start the quiz challenge
            </p>
          </Link>
        ))}
      </div>

      {/* Footer Section */}
      <div className="text-center mt-10 text-gray-500 text-sm">
        🚀 Keep practicing and boost your knowledge every week!
      </div>
    </div>
  );
};

export default QuizListPage;
