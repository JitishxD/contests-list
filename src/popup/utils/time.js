export function startOfDay(date) {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

export function addDays(date, days) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
}

export function toClistIsoNoMs(date) {
    const iso = date.toISOString()
    return iso.slice(0, 19)
}

export function parseClistDate(str) {
    if (!str) return null

    const hasTimezone = /([zZ]|[+-]\d{2}:\d{2})$/.test(str)
    const normalized = hasTimezone ? str : `${str}Z`

    const date = new Date(normalized)
    return Number.isNaN(date.getTime()) ? null : date
}

export function formatDurationSeconds(seconds) {
    const totalSeconds = Number(seconds)
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return ''

    const minutes = Math.floor((totalSeconds / 60) % 60)
    const hours = Math.floor((totalSeconds / 3600) % 24)
    const days = Math.floor(totalSeconds / 3600 / 24)

    const parts = []
    if (days > 0) parts.push(`${days} days`)
    if (hours > 0) parts.push(`${hours} hours`)
    if (minutes > 0) parts.push(`${minutes} minutes`)

    return parts.join(' ')
}

export function formatStartDateTimeForUi(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return { date: '', time: '' }
    }

    const startLocale = date.toLocaleString('en-US')
    const [datePart = '', timePart = ''] = startLocale.split(', ')
    const [month = '', day = '', year = ''] = datePart.split('/')

    // Keep legacy UI format from custom.js: dd/mm/yyyy
    return {
        date: day && month && year ? `${day}/${month}/${year}` : datePart,
        time: timePart,
    }
}

export function formatCountdownMs(msRemaining) {
    const ms = Number(msRemaining)
    if (!Number.isFinite(ms)) return ''

    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
    return `${minutes}m ${seconds}s`
}

export function getContestCountdown({ startMs, endMs, nowMs = Date.now() }) {
    const start = Number(startMs)
    const end = Number(endMs)
    const now = Number(nowMs)

    if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(now)) {
        return { startsInText: '', endsInText: '' }
    }

    const startsInMs = start - now
    const endsInMs = end - now

    return {
        startsInText: startsInMs > 0 ? formatCountdownMs(startsInMs) : 'Started',
        endsInText: endsInMs > 0 ? formatCountdownMs(endsInMs) : 'Ended',
    }
}
