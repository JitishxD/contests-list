import { useCallback, useEffect, useState } from 'react'
import { fetchClistContests } from '../api/clist'
import {
    chromeStorageGet,
    chromeStorageRemove,
    chromeStorageSet,
    normalizeTimestamp,
} from '../utils/chromeStorage'

const CACHE_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

async function getCachedTimestamp() {
    const { timeStamp } = await chromeStorageGet(['timeStamp'])
    const ts = normalizeTimestamp(timeStamp)
    if (!ts) return null

    const stamp = new Date(ts)
    if (Number.isNaN(stamp.getTime())) return null

    return stamp
}

async function isCacheFresh() {
    const stamp = await getCachedTimestamp()
    if (!stamp) return false
    return Date.now() - stamp.getTime() < CACHE_TTL_MS
}

export function useClistContests() {
    const [contests, setContests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastFetchedAt, setLastFetchedAt] = useState(null)

    const load = useCallback(async ({ force = false, signal } = {}) => {
        setLoading(true)
        setError(null)

        if (!force && (await isCacheFresh())) {
            const { contests: cachedValue } = await chromeStorageGet(['contests'])
            if (Array.isArray(cachedValue)) {
                setContests(cachedValue)
                const stamp = await getCachedTimestamp()
                setLastFetchedAt(stamp)
                setLoading(false)
                return
            }
        }

        try {
            const objects = await fetchClistContests({ signal })
            setContests(objects)
            const stamp = new Date()
            setLastFetchedAt(stamp)
            await chromeStorageSet({ contests: objects, timeStamp: stamp.toISOString() })
            setLoading(false)
        } catch (e) {
            if (e?.name === 'AbortError') return
            setError(e)
            setContests([])
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        load({ signal: controller.signal })
        return () => controller.abort()
    }, [load])

    const refresh = useCallback(() => {
        chromeStorageRemove(['contests', 'timeStamp'])
        const controller = new AbortController()
        load({ force: true, signal: controller.signal })
    }, [load])

    return { contests, loading, error, refresh, lastFetchedAt }
}
