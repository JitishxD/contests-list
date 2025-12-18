function hasChromeStorage() {
    return typeof chrome !== 'undefined' && !!chrome?.storage?.local
}

function assertChromeStorage() {
    if (!hasChromeStorage()) {
        throw new Error('chrome.storage.local is not available in this context')
    }
}

export async function chromeStorageGet(keys) {
    assertChromeStorage()
    return await chrome.storage.local.get(keys)
}

export async function chromeStorageGetValue(key) {
    const result = await chromeStorageGet([key])
    return result?.[key]
}

export async function chromeStorageSet(obj) {
    assertChromeStorage()
    await chrome.storage.local.set(obj)
}

export async function chromeStorageSetValue(key, value) {
    await chromeStorageSet({ [key]: value })
}

export async function chromeStorageRemove(keys) {
    assertChromeStorage()
    await chrome.storage.local.remove(keys)
}

export function normalizeTimestamp(value) {
    if (!value) return null
    if (typeof value === 'string') return value
    if (value instanceof Date) return value.toISOString()
    return String(value)
}
