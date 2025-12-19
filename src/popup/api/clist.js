import { addDays, startOfDay, toClistIsoNoMs } from '../utils/time'

const CLIST_API_BASE_URL = 'https://clist.by/api/v4/contest/'

async function loadClistCredentials() {
    if (typeof chrome === 'undefined' || !chrome?.storage?.sync) {
        return { username: '', apiKey: '' }
    }

    const result = await chrome.storage.sync.get(['userSettings'])
    const userSettings = result?.userSettings

    const username =
        typeof userSettings?.clistUsername === 'string'
            ? userSettings.clistUsername.trim()
            : ''
    const apiKey =
        typeof userSettings?.clistApiKey === 'string' ? userSettings.clistApiKey.trim() : ''

    return { username, apiKey }
}

export async function fetchClistContests({ signal, now = new Date() } = {}) {
    const { username: clistUsername, apiKey: clistApiKey } = await loadClistCredentials()

    if (!clistUsername || !clistApiKey) {
        throw new Error(
            [
                'Missing Clist credentials.',
                'Open the extension Options page(from gear icon ⚙️)',
                'and set your Clist Username and API Key.',
                'You can get your API key from https://clist.by/accounts/api/',
            ].join('\n'),
        )
    }

    const nowString = toClistIsoNoMs(now)
    const startFrom = startOfDay(addDays(now, -32))
    const startFromString = toClistIsoNoMs(startFrom)

    const params = new URLSearchParams({
        username: clistUsername,
        api_key: clistApiKey,
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
