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
      className={`bg-[#141418] text-white h-full absolute left-0 top-0 transition-transform duration-300 ease-in-out z-20 overflow-y-auto w-64 border-r border-neutral-800 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 flex flex-col gap-3">
        {/* Platform Filters */}
        <div className="flex flex-col gap-2">
          {platforms.map((platform) => (
            <label
              key={platform.id}
              className={`cursor-pointer px-4 py-2 rounded-lg border font-medium transition-colors duration-150 flex items-center justify-center text-center ${
                selectedPlatforms.includes(platform.id)
                  ? "bg-neutral-800 border-l-4 border-l-emerald-400 border-t-neutral-700 border-r-neutral-700 border-b-neutral-700 text-white"
                  : "bg-neutral-800/50 border border-neutral-700 text-neutral-400 hover:bg-neutral-700/50 hover:text-white"
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
        <div className="flex flex-col gap-2 mt-2 border-t border-neutral-800 pt-4">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider px-1 mb-1 text-center">
            Time Filter
          </h3>
          <label
            className={`cursor-pointer px-4 py-2 rounded-lg border font-medium transition-colors duration-150 flex items-center justify-center text-center ${
              timeFilter === "today"
                ? "bg-neutral-800 border-l-4 border-l-emerald-400 border-t-neutral-700 border-r-neutral-700 border-b-neutral-700 text-white"
                : "bg-neutral-800/50 border border-neutral-700 text-neutral-400 hover:bg-neutral-700/50 hover:text-white"
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
            className={`cursor-pointer px-4 py-2 rounded-lg border font-medium transition-colors duration-150 flex items-center justify-center text-center ${
              timeFilter === "upcoming"
                ? "bg-neutral-800 border-l-4 border-l-emerald-400 border-t-neutral-700 border-r-neutral-700 border-b-neutral-700 text-white"
                : "bg-neutral-800/50 border border-neutral-700 text-neutral-400 hover:bg-neutral-700/50 hover:text-white"
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
