
import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { FaHome, FaListUl, FaBookOpen } from "react-icons/fa"; // Ensure react-icons is installed: npm install react-icons
import HomePage from "./pages/HomePage";
import QuizListPage from "./pages/QuizListPage";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";

function App() {
  return (
    <Router>
      {/* Global dark theme wrapper: Covers the entire screen with a dark gradient background */}
      <div className="min-h-screen overflow-hidden flex flex-col font-sans text-gray-200 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        
        {/* ======= NAVBAR ======= */}
        <nav className="backdrop-blur-lg bg-gray-900/70 sticky top-0 z-50 shadow-lg border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            {/* Logo Section */}
            <NavLink
              to="/"
              className="text-3xl font-extrabold text-white flex items-center gap-2 hover:scale-105 transition-transform duration-300 transform-gpu"
            >
              <FaBookOpen className="text-blue-400 text-3xl md:text-4xl drop-shadow-md" />
              <span className="tracking-wide">NPTEL Quiz</span>
            </NavLink>

            {/* Nav Links */}
            <div className="flex items-center gap-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-gray-300 font-medium text-lg hover:text-blue-400 transition-colors duration-200 ${
                    isActive ? "text-blue-400 underline underline-offset-4" : ""
                  }`
                }
              >
                <FaHome className="text-xl" />
                Home
              </NavLink>

              <NavLink
                to="/quizzes"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-gray-300 font-medium text-lg hover:text-blue-400 transition-colors duration-200 ${
                    isActive ? "text-blue-400 underline underline-offset-4" : ""
                  }`
                }
              >
                <FaListUl className="text-xl" />
                Quiz Weeks
              </NavLink>
            </div>
          </div>
        </nav>

        {/* ======= MAIN CONTENT AREA ======= */}
        {/* Removed w-full and changed py-8 to py-0 */}
        <main className="flex-grow mx-auto relative z-0 py-0 overflow-hidden"> 
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quizzes" element={<QuizListPage />} />
            <Route path="/quiz/:week" element={<QuizPage />} />
            <Route path="/results/:quizAttemptId" element={<ResultsPage />} />
          </Routes>
        </main>

        {/* ======= FOOTER ======= */}
        <footer className=" w-[100vw] bg-gray-950/80 text-gray-500 py-4 text-center border-t border-gray-700/50 text-sm ">
          <p className="tracking-wide">
            © {new Date().getFullYear()} NPTEL Organizational Behaviour Quiz
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 