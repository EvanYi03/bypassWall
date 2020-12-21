$(document).ready(function () {

  //send current page to background.js
  url = window.location.href;
  chrome.runtime.sendMessage({greeting: url}, function(response) {
  });

  let urlsArray = [];
  chrome.storage.local.get(['urlsArray'], function(result) {
    //add a "." to any page that is in the stored list of urls
    urlsArray = result['urlsArray'];
    console.log('urls array', urlsArray);

    getAllCookies();

    //  for (thisUrl in urlsArray){
    //   var currentLocation = location.href.toString();
    //   if (currentLocation.startsWith(urlsArray[thisUrl]) && !(currentLocation.startsWith(urlsArray[thisUrl] + "."))){
    //     var baseUrl  = urlsArray[thisUrl];
    //     var splitUrl = currentLocation.split(baseUrl);
    //     var leftover = splitUrl[1];
    //     location.replace(baseUrl + "." + leftover);
    //   }
    // }
  });
});

