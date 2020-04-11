document.addEventListener('DOMContentLoaded', documentEvents  , false);

// Update the relevant fields with the new data.
const setDOMInfo = info => {
  chrome.storage.local.get(['urlsArray'], function(result) {
    document.getElementById('urls').textContent = JSON.stringify(result['urlsArray']);
    for (i in result['urlsArray']){
      var thisUrl = result['urlsArray'][i];
      document.getElementById("removeForm").innerHTML += '<input type="checkbox" value="' + thisUrl + '" name="url_' + i + '"> <label for="url_' + i + '">' + thisUrl + '</label><br>'; 
    }
    document.getElementById("removeForm").innerHTML += '<br><input id="remove_urls_submit" type="submit" value="Remove these Urls">'
  });
};

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'DOMInfo'},
        // ...also specifying a callback to be called 
        //    from the receiving end (content script).
        setDOMInfo);
  });
});

function stripTrailingSlash(str) {
  if(str.substr(-1) === '/') {
      return str.substr(0, str.length - 1);
  }
  return str;
}

function addUrl(input) { 
    if (input.value == ''){
      alert('Empty string entered');
      return;
    } 
    if (!input.value.startsWith('http://') && !input.value.startsWith('https://')){
      alert('No protocol specified');
      return;
    }

    //retrieve stored urls array
    var newArray = []
    chrome.storage.local.get(['urlsArray'], function(result) {
      var storedArray = result['urlsArray'];
      for (i in storedArray){
        newArray.push(storedArray[i]);
      }

      //push item to array if not already included
      if (!newArray.includes(stripTrailingSlash(input.value))){
        newArray.push(stripTrailingSlash(input.value));
      }

      chrome.storage.local.set({urlsArray: newArray}, function() {
        //refresh the popup after writing to storage
        window.location.href="popup.html";
      });

  });
  
}

function removeStoredUrl(url){
  chrome.storage.local.get(['urlsArray'], function(result) {
    var storedArray = result['urlsArray'];
    storedArray.splice(storedArray.indexOf(url), 1);
    chrome.storage.local.set({urlsArray: storedArray}, function() {
    });
  });
}

function removeUrls(input){
  var deleteArray = [];
  for (i in Object.keys(input)){
    if (input[i].checked) deleteArray.push(input[i].value);
  }
  for (i in deleteArray){
    var deleteUrl = deleteArray[i];
    removeStoredUrl(deleteUrl);
  }
}

function documentEvents() {    
    document.getElementById('submit_button').addEventListener('click', 
      function() { addUrl(document.getElementById('url_textbox'));
    });

    document.getElementById('removeForm').addEventListener('submit', 
    function() { removeUrls(document.getElementById('removeForm'));
  });
}
