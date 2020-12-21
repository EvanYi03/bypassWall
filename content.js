$(document).ready(function () {

  let urlsArray = [];
  chrome.storage.local.get(['urlsArray'], function(result) {

    try{
      // set current page url to send to background.js
      const thisUrl = window.location.href;
      const thisProtocol = window.location.protocol;
      const thisWwwHost = window.location.host;
      const thisHost = thisWwwHost.split("www.")[1];
      const thisOrigPath = thisProtocol + "//" + thisWwwHost;

      // add a "." to any page that is in the stored list of urls
      urlsArray = result['urlsArray'];

      // send urls array to background.js
      chrome.runtime.sendMessage({storedUrlsArray : urlsArray, currentUrl : thisUrl, fullOrigPath : thisOrigPath, fullWwwHost : thisWwwHost, plainHost : thisHost}, function(response) {
      });
    }catch(error){
      throw error;
    }
  });
});

