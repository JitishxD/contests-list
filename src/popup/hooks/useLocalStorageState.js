import { useEffect, useRef, useState } from 'react'
import { chromeStorageGetValue, chromeStorageSetValue } from '../utils/chromeStorage'

export function useLocalStorageState(key, defaultValue) {
    const resolvedDefault =
        typeof defaultValue === 'function' ? defaultValue() : defaultValue

    const [value, setValue] = useState(resolvedDefault)
    const hydratedRef = useRef(false)

    useEffect(() => {
        let cancelled = false

            ; (async () => {
                const stored = await chromeStorageGetValue(key)
                if (cancelled) return
                if (stored !== undefined) setValue(stored)
                hydratedRef.current = true
            })()

        return () => {
            cancelled = true
        }
    }, [key])

    useEffect(() => {
        if (!hydratedRef.current) return
        chromeStorageSetValue(key, value)
    }, [key, value])

    return [value, setValue]
}
