import { addDays, startOfDay, toClistIsoNoMs } from '../utils/time'

const CLIST_API_BASE_URL = 'https://clist.by/api/v4/contest/'

const CLIST_USERNAME = import.meta.env.VITE_CLIST_USERNAME
const CLIST_API_KEY = import.meta.env.VITE_CLIST_API_KEY

export async function fetchClistContests({ signal, now = new Date() } = {}) {
    if (!CLIST_USERNAME || !CLIST_API_KEY) {
        throw new Error(
            [
                'Missing Clist credentials.',
                'Set VITE_CLIST_USERNAME and VITE_CLIST_API_KEY in a .env file.',
                'See .env.example for reference.',
                'You can get your API key from https://clist.by/accounts/api/',
            ].join('\n'),
        )
    }

    const nowString = toClistIsoNoMs(now)
    const startFrom = startOfDay(addDays(now, -32))
    const startFromString = toClistIsoNoMs(startFrom)

    const params = new URLSearchParams({
        username: CLIST_USERNAME,
        api_key: CLIST_API_KEY,
        format: 'json',
        order_by: 'start',
        limit: '1000',
        end__gt: nowString,
        start__gt: startFromString,
    })

    const url = `${CLIST_API_BASE_URL}?${params.toString()}`

    const response = await fetch(url, { signal })
    if (!response.ok) {
        const statusText = response.statusText ? ` ${response.statusText}` : ''
        throw new Error(`Clist API request failed: ${response.status}${statusText}`)
    }

    const json = await response.json()
    const objects = json?.objects
    return Array.isArray(objects) ? objects : []
}
