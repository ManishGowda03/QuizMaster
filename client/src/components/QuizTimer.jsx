import React from "react";

const QuizTimer = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // 🎯 Color based on ACTUAL time
  let colorClass = "text-green-600";

  if (timeLeft <= 60) {
    colorClass = "text-red-600 animate-pulse";
  } else if (timeLeft <= 180) {
    colorClass = "text-yellow-500"; // 🟡 < 3 min
  }

  return (
    <div className="flex justify-end mb-6 pr-4">
      <span className={`text-2xl font-bold ${colorClass}`}>
        {formattedTime}
      </span>
    </div>
  );
};

export default QuizTimer;