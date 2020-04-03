document.addEventListener('DOMContentLoaded', documentEvents  , false);

function myAction(input) { 
    console.log("input value is : " + input.value);
    alert("The entered data is : " + input.value);
}

function documentEvents() {    
  document.getElementById('submit_button').addEventListener('click', 
    function() { myAction(document.getElementById('url_textbox'));
  });
}