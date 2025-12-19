import React from "react";

import { PLATFORMS as platforms } from "../constants/platforms";

const Sidebar = ({
  isOpen,
  selectedPlatforms,
  onPlatformChange,
  timeFilter,
  onTimeFilterChange,
}) => {
  return (
    <div
      className={`bg-gray-900 text-white h-full absolute left-0 top-0 transition-transform duration-300 ease-in-out z-20 overflow-y-auto w-64 border-r border-gray-800 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 flex flex-col gap-4">
        {/* Platform Filters */}
        <div className="flex flex-col gap-2">
          {platforms.map((platform) => (
            <label
              key={platform.id}
              className={`cursor-pointer px-4 py-2 rounded border transition-colors duration-200 text-center ${
                selectedPlatforms.includes(platform.id)
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-700 text-gray-200 hover:bg-gray-800"
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={selectedPlatforms.includes(platform.id)}
                onChange={() => onPlatformChange(platform.id)}
              />
              {platform.label}
            </label>
          ))}
        </div>

        {/* Time Filters */}
        <div className="flex flex-col gap-2 mt-4 border-t border-gray-800 pt-4">
          <label
            className={`cursor-pointer px-4 py-2 rounded border transition-colors duration-200 text-center ${
              timeFilter === "today"
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-gray-700 text-gray-200 hover:bg-gray-800"
            }`}
          >
            <input
              type="radio"
              name="timeFilter"
              className="hidden"
              checked={timeFilter === "today"}
              onChange={() => onTimeFilterChange("today")}
            />
            Today
          </label>
          <label
            className={`cursor-pointer px-4 py-2 rounded border transition-colors duration-200 text-center ${
              timeFilter === "upcoming"
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-gray-700 text-gray-200 hover:bg-gray-800"
            }`}
          >
            <input
              type="radio"
              name="timeFilter"
              className="hidden"
              checked={timeFilter === "upcoming"}
              onChange={() => onTimeFilterChange("upcoming")}
            />
            Upcoming
          </label>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
