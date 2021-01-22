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
        
        try {
    
            for (const thisUrl of thisArray) {
                const theseCookies = await getCookiesArray(thisUrl);
                const theseDotCookies = await getCookiesArray("." + thisUrl);
                //these seem common, so get rid of them too while we're in there
                const dotGoogleCookies = await getCookiesArray(".google.com");
                theseCookies.concat(theseDotCookies);
                theseCookies.concat(dotGoogleCookies);
                //console.log('these cookies', theseCookies);
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

                    // delete cookies with this domain
                    try {
                        chrome.cookies.remove({"url": "https://" + url, "name": cookie.name}, function(deleted_cookie) {
                            //console.log("Deleted cookie:", deleted_cookie); 
                        });
                    }catch(error){
                        console.log("Error deleting cookie:", error);
                    }
                }
            }
        }
    }

    while (true){
        let cookiesArray = new Array();
        for await (let domain of  domainsArray){
            //console.log('domain:', domain);
            cookiesArray.push(await getCookiesArray(domain));
            //console.log('cookies array', cookiesArray);
            
        }
        // let cookiesArray = await getCookiesArray(currentUrl);
        // console.log('current', currentUrl);
        //console.log('cookies array', cookiesArray);
        //console.log('cookies array len', cookiesArray.length);
        if (cookiesArray.length > 0){
            //console.log('Processing Now', cookiesArray);
            processArray(domainsArray).then((res) => {
                clearCookies(res);
            })
        }
    }
})