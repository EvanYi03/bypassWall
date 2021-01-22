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
                //console.log('google cookies', dotGoogleCookies);
                theseCookies.concat(theseDotCookies);
                //console.log('these cookies', theseCookies);
                promisesArray.push(theseCookies);
                allCookiesMap.set(thisUrl, theseCookies);
                allCookiesMap.set(".google.com", dotGoogleCookies);

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

    const arraysAreEmpty = (containingArray) => {
        // for given array, if all sub-arrays are empty, return true
        for (let array of containingArray){
            if (array.length != 0){
                //console.log('returning for array', array);
                return false;
            }
        }
        return true;
    }

    const returnNonEmptyArrays = (containingArray) => {
        // for given array, return an array containing any non-empty arrays
        let nonEmptyArrays = new Array();
        for (let array of containingArray){
            if (array.length != 0){
                nonEmptyArrays.push(array);
            }
        }
        return nonEmptyArrays;
    }

    const getUniqueArray = (thisArray) => {
        // return a unique-ified array for a given array
        var temp = {};
        for (var i = 0; i < thisArray.length; i++)
            temp[thisArray[i]] = true;
        var r = [];
        for (var k in temp)
            r.push(k);
        return r;
    }


    // delay
    setInterval(async () => {
        domainsArray = getUniqueArray(domainsArray);
        // construct array of arrays containing cookies for each domain
        let cookiesArray = new Array();
        for await (let domain of domainsArray){
            //console.log('domain:', domain);
            cookiesArray.push(await getCookiesArray(domain));
            //console.log('cookies array', cookiesArray);
            
        }
        // let cookiesArray = await getCookiesArray(currentUrl);
        // console.log('current', currentUrl);
        //console.log('cookies array', cookiesArray);
        //console.log('cookies array len', cookiesArray.length);
        if (!arraysAreEmpty(cookiesArray)){
            //console.log('Processing Now', cookiesArray);
            let nonEmpty = returnNonEmptyArrays(cookiesArray);
            for (let array of nonEmpty){
                for (let cookie of array){
                    // add any domains that were not included originally
                    // from non-empty domains array
                    domainsArray.push(cookie.domain);
                }
            }
            //console.log('domains array', domainsArray);
            processArray(domainsArray).then((res) => {
                clearCookies(res);
            })
        }
    }, 500);
})