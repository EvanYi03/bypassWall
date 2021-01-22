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

      // run cookie collection and deletion when the domain is within stored list
      urlsArray = result['urlsArray'];
      const currentLocation = location.href.toString();

      // for any string in stored list, if it starts with that string, then run send the message to delete
      for (let thisUrl of urlsArray){
        if (currentLocation.startsWith(thisUrl)){
          chrome.runtime.sendMessage({storedUrlsArray : urlsArray, currentUrl : thisUrl, fullOrigPath : thisOrigPath, fullWwwHost : thisWwwHost, plainHost : thisHost}, function(response) {});
        }
      }

    }catch(error){
      throw error;
    }
  });
});

