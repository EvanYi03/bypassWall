const getCookiesArray = async (thisUrl) => {
    return new Promise(function(resolve,reject){
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

        const getArrayAsync = async (thisUrl) => {  
            return await getCookiesArray(thisUrl);
        }
        
        try {
    
            for (const thisUrl of thisArray) {
                const theseCookies = await getCookiesArray(thisUrl);
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
        
        // make list of cookie names for use by the cookies' API
        let cookiesNames = new Array();
        console.log('cookiesmap', cookiesMap);
        console.log('this cookiesMap keys', cookiesMap.keys());

        // loop through map of cookies urls, and if their array is not empty, add to list

        for (let url of cookiesMap.keys()){

            let thisCookieArray = cookiesMap.get(url);
            
            if (thisCookieArray.length != 0) {
                // add cookie to cookiesNames list
                for (let cookie of thisCookieArray){
                    cookiesNames.push(cookie.name);
                }
            }
            console.log('cookiesNames:', cookiesNames);
        }
    }

    processArray(domainsArray).then((res) => {
        clearCookies(res);
    })
})