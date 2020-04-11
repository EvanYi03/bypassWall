$(document).ready(function () {

  var urlsArray = [];
  chrome.storage.local.get(['urlsArray'], function(result) {
    //add a "." to any page that is in the stored list of urls
    urlsArray = result['urlsArray'];

     for (thisUrl in urlsArray){
      var currentLocation = location.href.toString();
      if (currentLocation.startsWith(urlsArray[thisUrl]) && !(currentLocation.startsWith(urlsArray[thisUrl] + "."))){
        var baseUrl = urlsArray[thisUrl];
        location.replace(baseUrl + ".");
      }
    }
  });
});

