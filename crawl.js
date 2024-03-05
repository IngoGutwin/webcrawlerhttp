function normalizeURL(urlstring) {
    const urlObj = new URL(urlstring);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        console.log(hostPath.slice(0, -1));
        return hostPath.slice(0, -1);
    }
    return hostPath;
}

module.exports = {
    normalizeURL,
}
