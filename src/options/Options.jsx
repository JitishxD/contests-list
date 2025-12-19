import { useRef, useState, useEffect } from "react";
import SettingsTab from "./Components/SettingsTab";
import DataManagementTab from "./Components/DataManagementTab";

const DEFAULT_HOSTS = ["codeforces.com"];
const DEFAULT_TIME_FILTER = "upcoming";

const DEFAULT_USER_SETTINGS = {
  dummySetting: false,
  clistUsername: "",
  clistApiKey: "",
};

const sanitizeUserSettings = (raw) => {
  return {
    ...DEFAULT_USER_SETTINGS,
    dummySetting: !!raw?.dummySetting,
    clistUsername:
      typeof raw?.clistUsername === "string" ? raw.clistUsername : "",
    clistApiKey: typeof raw?.clistApiKey === "string" ? raw.clistApiKey : "",
  };
};

export const Options = () => {
  const [activeTab, setActiveTab] = useState("settings"); // 'settings' or 'data'
  const [syncData, setSyncData] = useState(null);
  const [localData, setLocalData] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [stats, setStats] = useState({ sync: 0, local: 0 });
  const [settings, setSettings] = useState(DEFAULT_USER_SETTINGS);

  const [popupPreferences, setPopupPreferences] = useState({
    hosts: DEFAULT_HOSTS,
    timeFilter: DEFAULT_TIME_FILTER,
  });

  const settingsLoadedRef = useRef(false);
  const popupPreferencesLoadedRef = useRef(false);
  const skipNextSettingsWriteRef = useRef(false);
  const skipNextPopupPreferencesWriteRef = useRef(false);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
    loadSettings();
    loadPopupPreferences();

    // Listen for storage changes from other components (like popup)
    const handleStorageChange = (changes, area) => {
      // Update settings when they change
      if (area === "sync" && changes.userSettings) {
        skipNextSettingsWriteRef.current = true;
        setSettings(sanitizeUserSettings(changes.userSettings.newValue));
      }

      // Update popup preferences when they change
      if (area === "local") {
        if (changes.hosts) {
          skipNextPopupPreferencesWriteRef.current = true;
          setPopupPreferences((prev) => ({
            ...prev,
            hosts: changes.hosts.newValue ?? prev.hosts ?? DEFAULT_HOSTS,
          }));
        }
        if (changes.timeFilter) {
          skipNextPopupPreferencesWriteRef.current = true;
          setPopupPreferences((prev) => ({
            ...prev,
            timeFilter:
              changes.timeFilter.newValue ??
              prev.timeFilter ??
              DEFAULT_TIME_FILTER,
          }));
        }
      }

      // Reload all data when ANY sync or local storage changes
      loadAllData();
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  // Auto-save settings whenever they change
  useEffect(() => {
    if (!settingsLoadedRef.current) return;
    if (skipNextSettingsWriteRef.current) {
      skipNextSettingsWriteRef.current = false;
      return;
    }

    const saveTimeout = setTimeout(async () => {
      try {
        await chrome.storage.sync.set({ userSettings: settings });
      } catch (error) {
        console.error("Error auto-saving settings:", error);
        showNotification("Error saving settings: " + error.message, "error");
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(saveTimeout);
  }, [settings]);

  // Auto-save popup preferences (used by popup) whenever they change
  useEffect(() => {
    if (!popupPreferencesLoadedRef.current) return;
    if (skipNextPopupPreferencesWriteRef.current) {
      skipNextPopupPreferencesWriteRef.current = false;
      return;
    }

    const saveTimeout = setTimeout(async () => {
      try {
        await chrome.storage.local.set({
          hosts: popupPreferences.hosts,
          timeFilter: popupPreferences.timeFilter,
        });
      } catch (error) {
        console.error("Error auto-saving popup preferences:", error);
        showNotification(
          "Error saving popup preferences: " + error.message,
          "error"
        );
      }
    }, 300);

    return () => clearTimeout(saveTimeout);
  }, [popupPreferences]);

  const loadSettings = async () => {
    try {
      const result = await chrome.storage.sync.get(["userSettings"]);
      if (result.userSettings) {
        setSettings(sanitizeUserSettings(result.userSettings));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      settingsLoadedRef.current = true;
    }
  };

  const loadPopupPreferences = async () => {
    try {
      const result = await chrome.storage.local.get(["hosts", "timeFilter"]);
      setPopupPreferences({
        hosts: Array.isArray(result.hosts) ? result.hosts : DEFAULT_HOSTS,
        timeFilter: result.timeFilter ?? DEFAULT_TIME_FILTER,
      });
    } catch (error) {
      console.error("Error loading popup preferences:", error);
    } finally {
      popupPreferencesLoadedRef.current = true;
    }
  };

  const confirmAndRun = async ({
    confirmMessage,
    run,
    successMessage,
    errorPrefix,
  }) => {
    if (!confirm(confirmMessage)) return;
    try {
      await run();
      await loadAllData();
      showNotification(successMessage, "success");
    } catch (error) {
      showNotification(`${errorPrefix}: ${error.message}`, "error");
    }
  };

  const loadAllData = async () => {
    try {
      // Get all sync storage data
      const syncStorage = await chrome.storage.sync.get(null);
      setSyncData(syncStorage);

      // Get all local storage data
      const localStorageData = await chrome.storage.local.get(null);
      setLocalData(localStorageData);

      // Calculate stats
      const syncKeys = Object.keys(syncStorage).length;
      const localKeys = Object.keys(localStorageData).length;

      setStats({
        sync: syncKeys,
        local: localKeys,
      });
    } catch (error) {
      showNotification("Error loading data: " + error.message, "error");
    }
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const downloadJson = ({ filenamePrefix, data }) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filenamePrefix}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export all data (sync + local)
  const exportAllData = () => {
    const allData = {
      sync: syncData || {},
      local: localData || {},
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    downloadJson({
      filenamePrefix: "contests-list-extension-backup",
      data: allData,
    });

    showNotification("Data exported successfully!", "success");
  };

  // Export only sync storage
  const exportSyncData = () => {
    const data = {
      sync: syncData || {},
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    downloadJson({ filenamePrefix: "contests-list-sync-backup", data });

    showNotification("Sync data exported successfully!", "success");
  };

  // Export only local storage
  const exportLocalData = () => {
    const data = {
      local: localData || {},
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    downloadJson({ filenamePrefix: "contests-list-local-backup", data });

    showNotification("Local data exported successfully!", "success");
  };

  // Import data from file
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // Validate data structure
        if (!importedData.sync && !importedData.local) {
          throw new Error("Invalid backup file format");
        }

        // Import sync data
        if (importedData.sync && Object.keys(importedData.sync).length > 0) {
          await chrome.storage.sync.set(importedData.sync);
        }

        // Import local data
        if (importedData.local && Object.keys(importedData.local).length > 0) {
          await chrome.storage.local.set(importedData.local);
        }

        // Reload data to show updated values
        await loadAllData();
        showNotification("Data imported successfully!", "success");
      } catch (error) {
        showNotification("Error importing data: " + error.message, "error");
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = "";
  };

  // Clear all sync storage
  const clearSyncData = async () => {
    await confirmAndRun({
      confirmMessage:
        "Are you sure you want to clear ALL sync storage data? This cannot be undone!",
      run: () => chrome.storage.sync.clear(),
      successMessage: "Sync storage cleared successfully!",
      errorPrefix: "Error clearing sync storage",
    });
  };

  // Clear all local storage
  const clearLocalData = async () => {
    await confirmAndRun({
      confirmMessage:
        "Are you sure you want to clear ALL local storage data? This cannot be undone!",
      run: () => chrome.storage.local.clear(),
      successMessage: "Local storage cleared successfully!",
      errorPrefix: "Error clearing local storage",
    });
  };

  // Clear all storage (both sync and local)
  const clearAllData = async () => {
    await confirmAndRun({
      confirmMessage:
        "⚠️ WARNING: This will delete ALL extension data (sync + local). This cannot be undone! Are you absolutely sure?",
      run: async () => {
        await chrome.storage.sync.clear();
        await chrome.storage.local.clear();
      },
      successMessage: "All storage cleared successfully!",
      errorPrefix: "Error clearing storage",
    });
  };

  return (
    <main className="min-h-screen bg-[#0e0e12] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-indigo-400 mb-2">
            ⚙️ Extension Options
          </h1>
          <p className="text-gray-400">
            Configure settings and manage your data
          </p>
        </div>

        {/* Notification */}
        {notification.show && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.type === "success"
                ? "bg-green-900 border border-green-600 text-green-200"
                : "bg-red-900 border border-red-600 text-red-200"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1b1b22] rounded-lg p-4 border border-gray-800 hover:border-blue-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Sync Storage Keys</p>
                <p className="text-3xl font-bold text-blue-400">{stats.sync}</p>
              </div>
              <div className="text-4xl">☁️</div>
            </div>
          </div>
          <div className="bg-[#1b1b22] rounded-lg p-4 border border-gray-800 hover:border-purple-500 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Local Storage Keys</p>
                <p className="text-3xl font-bold text-purple-400">
                  {stats.local}
                </p>
              </div>
              <div className="text-4xl">💾</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "settings"
                ? "bg-indigo-600 text-white"
                : "bg-[#1b1b22] text-gray-400 hover:bg-[#2b2b33]"
            }`}
          >
            ⚙️ Settings
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "data"
                ? "bg-indigo-600 text-white"
                : "bg-[#1b1b22] text-gray-400 hover:bg-[#2b2b33]"
            }`}
          >
            💾 Data Management
          </button>
        </div>

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <SettingsTab
            settings={settings}
            handleToggle={handleToggle}
            handleChange={handleChange}
            popupPreferences={popupPreferences}
            setPopupPreferences={setPopupPreferences}
          />
        )}

        {/* Data Management Tab */}
        {activeTab === "data" && (
          <DataManagementTab
            stats={stats}
            syncData={syncData}
            localData={localData}
            exportAllData={exportAllData}
            exportSyncData={exportSyncData}
            exportLocalData={exportLocalData}
            importData={importData}
            clearSyncData={clearSyncData}
            clearLocalData={clearLocalData}
            clearAllData={clearAllData}
          />
        )}
      </div>
    </main>
  );
};

export default Options;
