import React from "react";

function formatLastUpdated(lastFetchedAt) {
  if (!lastFetchedAt) return "";
  const date =
    lastFetchedAt instanceof Date ? lastFetchedAt : new Date(lastFetchedAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
}

const Header = ({
  onToggleSidebar,
  onRefresh,
  lastFetchedAt,
  onOpenModal,
  isSidebarOpen,
}) => {
  const lastUpdatedText = formatLastUpdated(lastFetchedAt);

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-gray-900 text-white border-b border-gray-800">
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
        >
          Filter
        </button>

        <button
          onClick={onRefresh}
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 border border-gray-700"
        >
          Refresh
        </button>

        {lastUpdatedText ? (
          <div
            className={
              "text-gray-400 min-w-0 " +
              (isSidebarOpen
                ? "text-[11px] whitespace-normal wrap-break-word leading-tight max-w-[150px]"
                : "text-[15px] whitespace-nowrap")
            }
            title={lastUpdatedText}
          >
            Last updated: {lastUpdatedText}
          </div>
        ) : null}
      </div>

      <div className="header-socialRow">
        <button
          onClick={onOpenModal}
          className="text-white hover:text-gray-300 header-socialItem header-socialItem--1"
          title="Buy me a coffee"
        >
          <img src="/icons/coffee.svg" alt="Donate" className="w-6 h-6" />
        </button>

        <a
          href="https://github.com/JitishxD/contests-list"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 header-socialItem header-socialItem--2"
        >
          <img src="/icons/github.svg" alt="GitHub" className="w-6 h-6" />
        </a>

        <a
          href="https://www.linkedin.com/in/jitish/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 header-socialItem header-socialItem--3"
        >
          <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};

export default Header;
