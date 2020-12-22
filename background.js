const getAllCookiesForTab = async (message) => {

    const url = message.currentUrl;

    // construct array of hosts and domains to try
    let domainsArray = new Array();
    domainsArray.push(message.fullOrigPath);
    domainsArray.push(message.fullWwwHost);
    domainsArray.push(message.plainHost);
    
    // iterate through domains array and get cookies keys
    // return map of cookies for each
    let allCookiesMap = new Map();
    for (let item in domainsArray){
    // add array of cookies keys to map for each domain name
        getCookiesArray(domainsArray[item]).then(thisArray => {
            allCookiesMap.set(domainsArray[item], thisArray); 
        });
    }

    return allCookiesMap;
}

const getCookiesArray = async (thisUrl) => {
    let keysArray = new Array();
    chrome.cookies.getAll({domain: thisUrl}, function(cookiesArray) {       
        for (let i = 0; i < cookiesArray.length; i++) {
            if (cookiesArray.length > 0) keysArray.push(cookiesArray[i].name);
        }
    });
    return keysArray;
}

// run process on content message
chrome.runtime.onMessage.addListener(async function(message ,sender, sendResponse){
    const storedUrlsArray = message.storedUrlsArray;
    const allCookiesMap = getAllCookiesForTab(message);
    allCookiesMap.then(thisMap => {
        console.log('thisMap', thisMap);
        for (let thisUrl of thisMap.keys()) {
            console.log('this url', thisUrl);
            console.log('this array', thisMap.get(thisUrl));
            let thisCookiesArray = thisMap.get(thisUrl);
            console.log('this cookies array', thisCookiesArray);
            // WHY WON'T EITHER OF THESE LOOPS RUN?
            // IT SEEMS ASYNC BC THE BELOW LOG IS UNDEFINED BUT LOOK AT    
            console.log('just to test', thisCookiesArray[0]);
            thisCookiesArray.forEach(thisCookie => {
                console.log(thisCookie);
            })
            for (i = 0; i < thisCookiesArray.length; i++){
                console.log(thisCookiesArray[i]);
            }
    
        }
    //     cookiesMapArray.forEach(thisUrl => {
    //         console.log(thisUrl);
    //     // let thisCookiesArray = allCookiesMap[thisUrl];
    //     // try{
    //     //     console.log('Array length', thisCookiesArray.length);
    //     //     console.log('Array', thisCookiesArray);
    //     //     thisCookiesArray.forEach(thisCookie => {
    //     //         console.log(thisCookie);
    //     //     })
    //     // }catch(error){
    //     //     throw error;
    //     // }
    //    })
    })

    // WHY DO THESE STOP LOOPING?
    // IS IT BECAUSE ARRAY HAS LENGTH OF 0?
    // LOOK INTO MAKING ASYNC


    // for (let item = 0; item < cookiesMapArray.length; item++){
    //     let thisUrl = cookiesMapArray[item];
    //     let thisCookiesArray = allCookiesMap[thisUrl];
    //     console.log(thisCookiesArray);

    // }
})