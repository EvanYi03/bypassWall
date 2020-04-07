document.addEventListener('DOMContentLoaded', documentEvents  , false);

// Update the relevant fields with the new data.
const setDOMInfo = info => {
  chrome.storage.local.get(['urlsArray'], function(result) {
    document.getElementById('urls').textContent = JSON.stringify(result['urlsArray']);
    for (i in result['urlsArray']){
      var thisUrl = result['urlsArray'][i];
      document.getElementById("removeForm").innerHTML += '<input type="checkbox" id="url_' + i + '"> <label for="url_' + i + '">' + thisUrl + '</label><br>'; 
    }
    document.getElementById("removeForm").innerHTML += '<br><input type="submit" value="Remove these Urls">'
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
    console.log('input value is : ' + input.value);
    if (input.value == ''){
      alert('Empty string entered');
      return;
    } 
    if (!input.value.startsWith('http://') && !input.value.startsWith('https://')){
      alert('No protocol specified');
      return;
    }
    //alert("The entered url : " + input.value);

    //retrieve stored urls array
    var newArray = []
    chrome.storage.local.get(['urlsArray'], function(result) {
      //alert('Value currently is ' + JSON.stringify(result));
      var storedArray = result['urlsArray'];
      for (i in storedArray){
        //alert('pushing ' + storedArray[i] + 'to storage.');
        newArray.push(storedArray[i]);
      }

      //push item to array if not already included
      if (!newArray.includes(stripTrailingSlash(input.value))){
        //alert('pushing ' + input.value + 'to new array');
        newArray.push(stripTrailingSlash(input.value));
      }

      //alert('pushing ' + input.value + 'to new array');
      //alert('stored array will be ' + JSON.stringify(newArray));

      chrome.storage.local.set({urlsArray: newArray}, function() {
      });

  });
  
}

function removeUrls(input){
  alert(JSON.stringify(input));
}

function documentEvents() {    
    document.getElementById('submit_button').addEventListener('click', 
      function() { addUrl(document.getElementById('url_textbox'));
    });

    document.getElementById('removeForm').addEventListener('click', 
    function() { removeUrls(document.getElementById('removeForm'));
  });
}
