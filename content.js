$(document).ready(function () {

  //replace this with persisted list
  //urlsArray = ["https://www.nytimes.com"];
  var urlsArray = [];
  chrome.storage.local.get(['urlsArray'], function(result) {
    console.log('urls array = ' + JSON.stringify(result));
     urlsArray = result['urlsArray'];

     for (thisUrl in urlsArray){
      var currentLocation = location.href.toString();
      console.log('this url = ' + urlsArray[thisUrl]);
      if (currentLocation.startsWith(urlsArray[thisUrl]) && !(currentLocation.startsWith(urlsArray[thisUrl] + "."))){
        console.log('url got into this block = ' + urlsArray[thisUrl]);
        var baseUrl = urlsArray[thisUrl];
        console.log('changing url to ' + baseUrl + '.');
        location.replace(baseUrl + ".");
      }
    }
  });
});

