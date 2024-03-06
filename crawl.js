const { JSDOM } = require('jsdom');

async function crawlPage(currentURL) {
    console.log(`activly crawling: ${currentURL}`);

    try {
        const resp = await fetch(currentURL);

        if (await resp.status > 399) {
            console.log(`error in fetch: ${resp.status}, on page: ${currentURL}`);
            return;
        };

        const contentType = resp.headers.get('content-type');
        if (!contentType.includes("text/html")) {
            console.log(`not html response, content type: ${contentType}, on page: ${currentURL}`);
            return;
            
        }

        console.log(await resp.text());
    } catch (err) {
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`);
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    for (const linkElement of linkElements) {
        if (linkElement.href.slice(0, 1) === '/'){
            // relative
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObj.href);
            } catch (err) {
                console.log(`error with relative url: ${err.message}`);
            }
        } else {
            // absolute
            try {
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            } catch (err) {
                console.log(`error with absolute url: ${err.message}`);
            }
        }
    }
    return urls;
}

function normalizeURL(urlstring) {
    const urlObj = new URL(urlstring);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1);
    }
    return hostPath;
}

module.exports = {
    crawlPage,
    getURLsFromHTML,
    normalizeURL,
}
