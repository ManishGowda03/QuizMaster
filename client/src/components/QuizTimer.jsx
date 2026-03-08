import React from "react";

const QuizTimer = ({ duration, timeLeft }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  const progress = timeLeft / duration;
  const strokeDashoffset = circumference - progress * circumference;

  // Change color based on time left
  let color = "#3b82f6"; // blue

  if (progress < 0.5) {
    color = "#f59e0b"; // orange
  }

  if (progress < 0.2) {
    color = "#ef4444"; // red
  }

  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-28 h-28">

        <svg
          className="transform -rotate-90"
          width="110"
          height="110"
        >
          {/* Background circle */}
          <circle
            cx="55"
            cy="55"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />

          {/* Progress circle */}
          <circle
            cx="55"
            cy="55"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>

        {/* Timer text */}
        <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-gray-700">
          {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>

      </div>
    </div>
  );
};

export default QuizTimer;