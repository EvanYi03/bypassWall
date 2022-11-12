chrome.runtime.onMessage.addListener(async function(message ,sender, sendResponse){
    
    // construct array of hosts and domains to try
    let domainsArray = new Array();
    domainsArray.push(message.fullOrigPath);
    domainsArray.push(message.fullWwwHost);
    domainsArray.push(message.plainHost);
    
    console.log("Domains array");
    console.log(domainsArray);

    let urlPatterns = [];
    for (let url in domainsArray){
        urlPatterns.push(domainsArray[url]);
    }
    console.log(urlPatterns);
    
    chrome.webRequest.onCompleted.addListener(function (details) {
    
        for (domainToRemove in urlPatterns){
                domainToRemove = urlPatterns[domainToRemove];
                if (domainToRemove) {
                chrome.cookies.getAll({ domain: domainToRemove }, function (cookies) {
                    for (const ck of cookies) {
                    console.log("cookie");
                    console.log(cookies);
                    const cookie = {
                        url: (ck.secure ? 'https://' : 'http://') + ck.domain + ck.path,
                        name: ck.name,
                        storeId: ck.storeId
                    };
                    
                    if (ck.firstPartyDomain !== undefined) {
                        cookie.firstPartyDomain = ck.firstPartyDomain;
                    }

                    chrome.cookies.remove(cookie);
                    }
                });
                }
            }
      }, {
        urls: ['<all_urls>']
      });

})