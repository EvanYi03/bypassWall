const getCookiesArray = async (thisUrl) => {
    return new Promise(function(resolve,reject){
        // MAY HAVE TO MAKE THIS BROADER
        chrome.cookies.getAll({domain: thisUrl}, function(cookies) {
            resolve(cookies);
        });
    })
}

// run process on content message
chrome.runtime.onMessage.addListener(async function(message ,sender, sendResponse){
    
    const storedUrlsArray = message.storedUrlsArray;
    const currentUrl = message.currentUrl;

    // construct array of hosts and domains to try
    let domainsArray = new Array();
    domainsArray.push(message.fullOrigPath);
    domainsArray.push(message.fullWwwHost);
    domainsArray.push(message.plainHost);

    const processArray = async (thisArray) => {

        let promisesArray = new Array();
        let allCookiesMap = new Map();
        
        try {
    
            for (const thisUrl of thisArray) {
                const theseCookies = await getCookiesArray(thisUrl);
                const theseDotCookies = await getCookiesArray("." + thisUrl);
                theseCookies.concat(theseDotCookies);
                console.log('these cookies', theseCookies);
                promisesArray.push(theseCookies);
                allCookiesMap.set(thisUrl, theseCookies);

                //THERE'S LIKELY A BETTER WAY TO DO THIS
                if (promisesArray.length == thisArray.length){
                    return allCookiesMap;
                }  
            }
       }catch(error){
        console.log('ERROR', error);
       }
    }

    const clearCookies = async (cookiesMap) => {

        // loop through map of cookies urls, and if their array is not empty, add to list
        for (let url of cookiesMap.keys()){

            let thisCookieArray = cookiesMap.get(url);

            if (thisCookieArray.length != 0) {
                for await (let cookie of thisCookieArray){
                    //cookiesDomains.push(cookie.domain)

                    // delete cookies with this domain
                    try {
                        let theseCookies = await getCookiesArray(url);
                        while (theseCookies.length > 0){
                            theseCookies = await getCookiesArray(url);
                            console.log('in while', theseCookies);
                            chrome.cookies.remove({"url": "https://" + url, "name": cookie.name}, function(deleted_cookie) { console.log("Deleted cookie:", deleted_cookie); });
                        }
                        //chrome.cookies.remove({"url": "https://" + url, "name": cookie.name}, function(deleted_cookie) { console.log("Deleted cookie:", deleted_cookie); });
                    }catch(error){
                        console.log("Error deleting cookie:", error);
                    }
                }
            }
        }
    }

    processArray(domainsArray).then((res) => {
        clearCookies(res);
    })
})