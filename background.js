const getCookiesArray = async (thisUrl) => {
    return new Promise(function(resolve,reject){
        chrome.cookies.getAll({domain: thisUrl}, function(cookies) {
            //something may be going on here that's keeping elements from being
            //set in the map
            //!!!!!!!!!!!!!!!
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

    // // asyc generator (thus *)
    // async function* createAsyncIterable(syncIterable) {
    //     for (const elem of syncIterable) {
    //         yield elem;
    //     }
    // }

    // iterate through domains array and get cookies keys
    // return map of cookies for each

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
        console.log(cookiesArray);
    }

    
    console.log(processArray(domainsArray));

    processArray(domainsArray).then((res) => {
        console.log(res);
        clearCookies(res);
    })


    
    // processArray(domainsArray).then((thisMap) => {
    //     console.log('test', thisMap);
    //     // for (let thisUrlKey of thisMap.keys()){
    //     //     console.log(thisUrlKey);
    //     //     console.log(thisMap.get(thisUrlKey).length, thisMap.get(thisUrlKey));

    //     //     if (thisMap.get(thisUrlKey)[0]) console.log(thisMap.get(thisUrlKey));
    //     // }
    // });

    // domainsArray.forEach((thisUrl) => {
    // // add array of cookies keys to map for each domain name
    //     let keysArray = new Array();
    //      chrome.cookies.getAll({domain: thisUrl}, async function(cookiesArray) {       
    //         for (let thisCookie of cookiesArray) {
    //             if (cookiesArray.length > 0) keysArray.push(thisCookie.name);
    //             console.log('thisUrl', thisUrl);
    //             console.log('keysArray', keysArray);
    //             allCookiesMap[thisUrl] = keysArray;
    //         }
    //     console.log('allCookiesMap', allCookiesMap);
    //     });
    // })

    //console.log('allCookiesmap', allCookiesMap);
})