const getCookiesArray = async (thisUrl) => {
    return new Promise(function(resolve,reject){
        chrome.cookies.getAll({domain: thisUrl}, function(cookies) {
            console.log('cookies:', cookies);
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
                console.log('map url', thisUrl);
                console.log('map cookies', theseCookies);
                allCookiesMap.set(thisUrl, theseCookies);
                console.log('allCookiesMap', allCookiesMap);

                console.log('promises array len', promisesArray.length);
                console.log('thisarray len', thisArray.length);

                //THERE'S LIKELY A BETTER WAY TO DO THIS
                if (promisesArray.length == thisArray.length){
                    console.log('got to this');
                    return allCookiesMap;
                }  
            }
       }catch(error){
        console.log('ERROR', error);
       }
    }

    const clearCookies = async (cookiesArray) => {
        console.log('test cookies array', cookiesArray);
    }

    processArray(domainsArray).then((res) => {
        clearCookies(res);
    })
})