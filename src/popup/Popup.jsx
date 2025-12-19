import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ContestList from "./components/ContestList";
import DonationModal from "./components/DonationModal";
import { useClistContests } from "./hooks/useClistContests";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useFilteredContests } from "./hooks/useFilteredContests";
import "./index.css";

const DEFAULT_HOSTS = ["codeforces.com"];
const DEFAULT_TIME_FILTER = "upcoming";

export const Popup = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [hostsRaw, setHostsRaw] = useLocalStorageState("hosts", DEFAULT_HOSTS);
  const selectedPlatforms = Array.isArray(hostsRaw) ? hostsRaw : DEFAULT_HOSTS;
  const [timeFilter, setTimeFilter] = useLocalStorageState(
    "timeFilter",
    DEFAULT_TIME_FILTER
  );

  const {
    contests: apiContests,
    loading,
    error,
    refresh,
    lastFetchedAt,
  } = useClistContests();

  const contests = useFilteredContests({
    apiContests,
    selectedPlatforms,
    timeFilter,
  });

  const handlePlatformChange = (platformId) => {
    setHostsRaw((prev) => {
      const current = Array.isArray(prev) ? prev : DEFAULT_HOSTS;
      return current.includes(platformId)
        ? current.filter((p) => p !== platformId)
        : [...current, platformId];
    });
  };

  const handleTimeFilterChange = (filter) => setTimeFilter(filter);

  return (
    <div className="relative bg-gray-900 text-white overflow-hidden w-150 h-150">
      <Sidebar
        isOpen={isSidebarOpen}
        selectedPlatforms={selectedPlatforms}
        onPlatformChange={handlePlatformChange}
        timeFilter={timeFilter}
        onTimeFilterChange={handleTimeFilterChange}
      />

      <div
        className={`flex flex-col h-full transition-[padding] duration-300 ease-in-out ${
          isSidebarOpen ? "pl-64" : "pl-0"
        }`}
      >
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onRefresh={refresh}
          lastFetchedAt={lastFetchedAt}
          isSidebarOpen={isSidebarOpen}
          onOpenModal={() => setIsModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto relative">
          <ContestList contests={contests} loading={loading} error={error} />
        </main>
      </div>

      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Popup;
