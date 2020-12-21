const getAllCookiesForTab = () => {
    chrome.runtime.onMessage.addListener(function(message ,sender, sendResponse){
        console.log('message', message);
        const url = message.currentUrl;
        console.log('Current tab url = ', url);
    
        chrome.cookies.getAll({domain: "nytimes.com"}, function(cookiesArray) {
            console.log('Length of Cookies Array = ' + cookiesArray.length);        
                for(let i=0; i < cookiesArray.length; i++) {
                  console.log('This cookie = ' + cookiesArray[i].name);
                }
        });    
    })
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log('stored urls array', message.storedUrlsArray);   
})

getAllCookiesForTab();