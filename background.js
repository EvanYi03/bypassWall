const getAllCookiesForTab = (message) => {

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
        let thisCookiesArray = getCookiesArray(domainsArray[item]);
    // add array of cookies keys to map for each domain name
        allCookiesMap[domainsArray[item]] = thisCookiesArray;
    }

    return allCookiesMap;
}

const getCookiesArray = (thisUrl) => {
    let keysArray = new Array();
    chrome.cookies.getAll({domain: thisUrl}, function(cookiesArray) {       
        for (let i = 0; i < cookiesArray.length; i++) {
            if (cookiesArray.length > 0) keysArray.push(cookiesArray[i].name);
        }
    });
    return keysArray;
}

// run process on content message
chrome.runtime.onMessage.addListener(function(message ,sender, sendResponse){
    const storedUrlsArray = message.storedUrlsArray;
    const allCookiesMap = getAllCookiesForTab(message);
    const cookiesMapArray = Object.keys(allCookiesMap);
    console.log(cookiesMapArray.length);

    //WHY DO THESE STOP LOOPING?

    // cookiesMapArray.forEach(thisUrl => {
    //     let thisCookiesArray = allCookiesMap[thisUrl];
    //     try{
    //         thisCookiesArray.forEach(thisCookie => {
    //             console.log(thisCookie);
    //         })
    //     }catch(error){
    //         throw error;
    //     }
    // })

    // for (let item = 0; item < cookiesMapArray.length; item++){
    //     let thisUrl = cookiesMapArray[item];
    //     let thisCookiesArray = allCookiesMap[thisUrl];
    //     console.log(thisCookiesArray);

    // }
})