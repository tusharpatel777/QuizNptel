
import axios from 'axios';

const API_URL = 'https://quiznptel.onrender.com'; 

export const getQuizWeeks = async () => {
  try {
    const response = await axios.get(`${API_URL}/weeks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz weeks:', error);
    throw error;
  }
};

export const getQuestionsByWeek = async (week) => {
  try {
    const response = await axios.get(`${API_URL}/${week}/questions`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching questions for week ${week}:`, error);
    throw error;
  }
};

export const submitQuiz = async (week, answers, timeTaken) => {
  try {
    // Add Authorization header if you implement authentication (e.g., token: localStorage.getItem('token'))
    const response = await axios.post(`${API_URL}/submit`, { week, answers, timeTaken });
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};

export const getQuizAttemptById = async (quizAttemptId) => {
  try {
    const response = await axios.get(`${API_URL}/attempts/${quizAttemptId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching quiz attempt ${quizAttemptId}:`, error);
    throw error;
  }
};

export const getFullQuestionsByIds = async (questionIds) => {
  try {
    const response = await axios.post(`${API_URL}/questions-by-ids`, { questionIds });
    return response.data;
  } catch (error) {
    console.error('Error fetching full questions:', error);
    throw error;
  }
};

// Add functions for authentication and other user progress features if needed later