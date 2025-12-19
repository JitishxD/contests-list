import { useMemo } from "react";
import {
    addDays,
    formatDurationSeconds,
    formatStartDateTimeForUi,
    parseClistDate,
    startOfDay,
} from "../utils/time";
import { getPlatformLogoSrc } from "../constants/platformLogos";

export function useFilteredContests({ apiContests, selectedPlatforms, timeFilter }) {
    return useMemo(() => {
        const now = new Date();
        const tomorrow = startOfDay(addDays(now, 1));

        return (apiContests ?? [])
            .map((c) => {
                const start = parseClistDate(c?.start);
                const end = parseClistDate(c?.end);
                if (!start || !end) return null;

                const resource = c?.resource;
                if (!resource || !selectedPlatforms?.includes?.(resource)) return null;

                if (timeFilter === "today") {
                    if (!(end > now && start < tomorrow)) return null;
                } else {
                    if (!(start > now)) return null;
                }

                const startUi = formatStartDateTimeForUi(start);
                const endUi = formatStartDateTimeForUi(end);
                return {
                    id: c?.id ?? `${resource}:${c?.href ?? c?.event ?? ""}`,
                    event: c?.event ?? "Contest",
                    href: c?.href,
                    resource,
                    startMs: start.getTime(),
                    endMs: end.getTime(),
                    startDate: startUi.date,
                    startTime: startUi.time,
                    endDate: endUi.date,
                    endTime: endUi.time,
                    durationText: formatDurationSeconds(c?.duration ?? 0),
                    logoSrc: getPlatformLogoSrc(resource),
                };
            })
            .filter(Boolean);
    }, [apiContests, selectedPlatforms, timeFilter]);
}
