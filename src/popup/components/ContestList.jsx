import React, { useEffect, useState } from "react";
import { getContestCountdown } from "../utils/time";

const ContestLogo = ({ logoSrc, resource }) => {
  const [isLogoLoadFailed, setIsLogoLoadFailed] = useState(false);

  const showImage = !!logoSrc && !isLogoLoadFailed;

  return (
    <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 overflow-hidden">
      {showImage ? (
        <img
          src={logoSrc}
          alt={resource}
          className="w-8 h-8 object-contain"
          onError={() => setIsLogoLoadFailed(true)}
        />
      ) : (
        <span className="text-[10px] text-neutral-300 px-1 text-center">
          {resource}
        </span>
      )}
    </div>
  );
};

const ContestList = ({ contests, loading, error }) => {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

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
      <div className="text-xs text-neutral-500" aria-live="polite">
        {contests.length} contest{contests.length === 1 ? "" : "s"}
      </div>
      {contests.map((contest) => {
        const countdown = getContestCountdown({
          startMs: contest?.startMs,
          endMs: contest?.endMs,
          nowMs,
        });

        const startMs = Number(contest?.startMs);
        const endMs = Number(contest?.endMs);
        const isStarted = Number.isFinite(startMs) ? nowMs >= startMs : false;
        const isEnded = Number.isFinite(endMs) ? nowMs >= endMs : false;
        const showStartInfo = !isStarted;
        const showEndInfo = isStarted || isEnded;

        return (
          <div
            key={contest.id}
            className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-3 flex gap-3"
          >
            <ContestLogo
              logoSrc={contest.logoSrc}
              resource={contest.resource}
            />

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
                {showStartInfo ? (
                  <>
                    <div className="text-neutral-300">
                      <span className="text-neutral-500">Start:</span>{" "}
                      {contest.startDate} {contest.startTime}
                    </div>
                    {countdown.startsInText ? (
                      <div className="text-neutral-300">
                        <span className="text-neutral-500">Starts in:</span>{" "}
                        {countdown.startsInText}
                      </div>
                    ) : null}
                  </>
                ) : null}

                {showEndInfo ? (
                  <>
                    <div className="text-neutral-300">
                      <span className="text-neutral-500">End:</span>{" "}
                      {contest.endDate} {contest.endTime}
                    </div>
                    {countdown.endsInText ? (
                      <div className="text-neutral-300">
                        <span className="text-neutral-500">Ends in:</span>{" "}
                        {countdown.endsInText}
                      </div>
                    ) : null}
                  </>
                ) : null}

                <div className="text-neutral-300">
                  <span className="text-neutral-500">Duration:</span>{" "}
                  {contest.durationText}
                </div>
                <div className="text-neutral-300 truncate">
                  <span className="text-neutral-500">Platform:</span>{" "}
                  {contest.resource}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContestList;
