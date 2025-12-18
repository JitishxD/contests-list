export const PLATFORM_LOGOS = {
    'codechef.com': 'codechef.png',
    'codeforces.com': 'codeforces.svg',
    'atcoder.jp': 'atcoder.png',
    'geeksforgeeks.org': 'GeeksforGeeks.svg',
    'naukri.com/code360': 'naukri.jpg',
    'leetcode.com': 'leetcode.png',
    'topcoder.com': 'topcoder.png',
}

export function getPlatformLogoSrc(resource) {
    const filename = PLATFORM_LOGOS[resource]
    return filename ? `/logos/${filename}` : null
}
