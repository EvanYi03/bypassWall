$(document).ready(function () {

  //replace this with persisted list
  urlsArray = ["https://www.nytimes.com"];

  for (thisUrl in urlsArray){
    var currentLocation = location.href.toString();
    if (currentLocation.startsWith(urlsArray[thisUrl]) && !(currentLocation.startsWith(urlsArray[thisUrl] + "."))){
      var baseUrl = urlsArray[thisUrl];
      location.replace(baseUrl + ".");
    }
  }
});

