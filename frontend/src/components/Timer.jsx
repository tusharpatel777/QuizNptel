
import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ initialTime = 0, onTimeUpdate, isRunning }) => {
  const [time, setTime] = useState(initialTime);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, onTimeUpdate]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="relative inline-block text-lg font-bold">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg blur-xl opacity-30 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>

      {/* Timer display */}
      <div className="relative z-10 px-4 py-2 rounded-lg bg-[#1a1a2e] border border-[#2a2a3f] text-blue-300 shadow-lg flex items-center justify-center">
        ⏱ {formatTime(time)}
      </div>
    </div>
  );
};

export default Timer;
