import React from "react";

import { PLATFORMS } from "../../popup/constants/platforms";

const SettingsTab = ({
  settings,
  handleToggle,
  handleChange,
  popupPreferences,
  setPopupPreferences,
}) => {
  const selectedHosts = Array.isArray(popupPreferences?.hosts)
    ? popupPreferences.hosts
    : [];
  const timeFilter = popupPreferences?.timeFilter ?? "upcoming";

  const toggleHost = (hostId) => {
    setPopupPreferences((prev) => {
      const current = Array.isArray(prev?.hosts) ? prev.hosts : [];
      const nextHosts = current.includes(hostId)
        ? current.filter((h) => h !== hostId)
        : [...current, hostId];
      return { ...prev, hosts: nextHosts };
    });
  };

  return (
    <div className="space-y-6">
      {/* Extension Settings */}
      <div className="bg-[#1b1b22] rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-indigo-300 mb-4">
          ⚙️ Extension Settings
        </h2>

        <div className="flex items-center justify-between bg-[#0e0e12] border border-gray-800 rounded-lg p-4">
          <div>
            <p className="text-white font-medium">Dummy setting</p>
            <p className="text-gray-400 text-sm">
              This is a placeholder toggle.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleToggle("dummySetting")}
            className={`w-14 h-7 rounded-full transition ${
              settings?.dummySetting ? "bg-indigo-600" : "bg-gray-700"
            }`}
            aria-pressed={!!settings?.dummySetting}
            aria-label="Toggle dummy setting"
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings?.dummySetting ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Clist Credentials */}
      <div className="bg-[#1b1b22] rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-indigo-300 mb-2">
          🔑 Clist Credentials
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Saved in sync storage and used to fetch contests from clist.by.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Clist Username
            </label>
            <input
              type="text"
              value={settings?.clistUsername ?? ""}
              onChange={(e) => handleChange("clistUsername", e.target.value)}
              placeholder="Your clist.by username"
              className="w-full bg-[#0e0e12] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Clist API Key
            </label>
            <input
              type="password"
              value={settings?.clistApiKey ?? ""}
              onChange={(e) => handleChange("clistApiKey", e.target.value)}
              placeholder="Your clist.by API key"
              className="w-full bg-[#0e0e12] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              autoComplete="off"
            />
            <p className="text-xs text-gray-500 mt-2">
              Get your API key from https://clist.by/accounts/api/
            </p>
          </div>
        </div>
      </div>

      {/* Popup Preferences */}
      <div className="bg-[#1b1b22] rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-indigo-300 mb-2">
          🧩 Popup Preferences
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          These values are saved in local storage and used by the popup.
        </p>

        {/* Platforms */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-200 mb-3">Platforms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PLATFORMS.map((platform) => {
              const checked = selectedHosts.includes(platform.id);
              return (
                <label
                  key={platform.id}
                  className={`cursor-pointer px-4 py-3 rounded-lg border transition-colors text-center ${
                    checked
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-700 text-gray-200 hover:bg-[#2b2b33]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checked}
                    onChange={() => toggleHost(platform.id)}
                  />
                  {platform.label}
                </label>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Stored as local key <span className="font-mono">hosts</span>.
          </p>
        </div>

        {/* Time filter */}
        <div>
          <h3 className="text-lg font-medium text-gray-200 mb-3">
            Time filter
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { id: "today", label: "Today" },
              { id: "upcoming", label: "Upcoming" },
            ].map((opt) => {
              const checked = timeFilter === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`cursor-pointer flex-1 px-4 py-3 rounded-lg border transition-colors text-center ${
                    checked
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-700 text-gray-200 hover:bg-[#2b2b33]"
                  }`}
                >
                  <input
                    type="radio"
                    name="timeFilter"
                    className="hidden"
                    checked={checked}
                    onChange={() =>
                      setPopupPreferences((prev) => ({
                        ...prev,
                        timeFilter: opt.id,
                      }))
                    }
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Stored as local key <span className="font-mono">timeFilter</span>.
          </p>
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="flex justify-center">
        <p className="text-gray-400 text-sm italic">
          ✓ Settings are automatically saved
        </p>
      </div>
    </div>
  );
};

export default SettingsTab;
