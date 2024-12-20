import React from "react";
import { YearButton } from "./YearButton";
import { Goal } from "@/types/types";

type YearFilterProps = {
  filterYear: number | string;
  goals: Goal[];
  setFilterYear: (year: number | string) => void;
};

export const YearFilter: React.FC<YearFilterProps> = ({
  filterYear,
  goals,
  setFilterYear,
}) => {
  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("years-container");
    if (container) {
      container.scrollLeft += direction === "left" ? -200 : 200;
    }
  };

  return (
    <div className="relative mb-8">
      <div className="flex items-center">
        <button
          onClick={() => scrollContainer("left")}
          className="absolute left-0 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div
          id="years-container"
          className="flex overflow-x-auto gap-2 px-12 py-2 scroll-smooth hide-scrollbar"
        >
          <YearButton
            year=""
            label="All"
            isSelected={filterYear === ""}
            onClick={() => setFilterYear("")}
          />
          {[...new Set(goals.map((goal) => goal.year))]
            .sort((a, b) => b - a)
            .map((year) => (
              <YearButton
                key={year}
                year={year}
                label={year.toString()}
                isSelected={filterYear === year}
                onClick={() => setFilterYear(year)}
              />
            ))}
        </div>

        <button
          onClick={() => scrollContainer("right")}
          className="absolute right-0 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
