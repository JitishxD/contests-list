import React, { useState } from "react";

const ContestLogo = ({ logoSrc, resource }) => {
  const [isLogoLoadFailed, setIsLogoLoadFailed] = useState(false);

  const showImage = !!logoSrc && !isLogoLoadFailed;

  return (
    <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
      {showImage ? (
        <img
          src={logoSrc}
          alt={resource}
          className="w-8 h-8 object-contain"
          onError={() => setIsLogoLoadFailed(true)}
        />
      ) : (
        <span className="text-[10px] text-gray-200 px-1 text-center">
          {resource}
        </span>
      )}
    </div>
  );
};

const ContestList = ({ contests, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        <p className="text-lg">Compiling...</p>
      </div>
    );
  }

  if (error) {
    const errorText = error.message ? error.message : String(error);
    return (
      <div className="flex justify-center items-center h-64 text-white px-6 text-center">
        <div className="text-sm text-red-300">
          <div>Failed to load contests. Please try again.</div>
          {errorText ? (
            <pre className="mt-2 text-xs text-red-200 text-left font-mono whitespace-pre-wrap max-h-40 overflow-auto bg-black/20 rounded p-2">
              {errorText}
            </pre>
          ) : null}
        </div>
      </div>
    );
  }

  if (!contests || contests.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        <p className="text-lg">No contests found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-white space-y-3">
      <div className="text-xs text-gray-400" aria-live="polite">
        {contests.length} contest{contests.length === 1 ? "" : "s"}
      </div>
      {contests.map((contest) => (
        <div
          key={contest.id}
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex gap-3"
        >
          <ContestLogo logoSrc={contest.logoSrc} resource={contest.resource} />

          <div className="min-w-0 flex-1">
            {contest.href ? (
              <a
                href={contest.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-semibold text-sm text-white hover:underline truncate"
                title={contest.event}
              >
                {contest.event}
              </a>
            ) : (
              <div
                className="font-semibold text-sm text-white truncate"
                title={contest.event}
              >
                {contest.event}
              </div>
            )}

            <div className="mt-1 space-y-0.5 text-xs">
              <div className="text-gray-300">
                <span className="text-gray-400">Start:</span>{" "}
                {contest.startDate} {contest.startTime}
              </div>
              <div className="text-gray-300">
                <span className="text-gray-400">Duration:</span>{" "}
                {contest.durationText}
              </div>
              <div className="text-gray-300 truncate">
                <span className="text-gray-400">Platform:</span>{" "}
                {contest.resource}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContestList;
