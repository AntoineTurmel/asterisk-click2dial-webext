"use strict";

browser.runtime.onMessage.addListener(request => {
    //console.log("Message from the background script:");
    //console.log(request.action);
    return Promise.resolve({response: window.getSelection().toString().trim()});
  });

function hasNumbers(string)
{
  return /\d/.test(string);
}

// Workaround without onBeforeShow for Firefox < 60
// https://bugzilla.mozilla.org/show_bug.cgi?id=1215376
document.addEventListener("selectionchange", function() {
  // Check if the selected string has number in it
  if (hasNumbers(window.getSelection().toString().trim())) {
    var selectedNumber = window.getSelection().toString().trim().replace(/\+/g, "00").replace(/\D/g,'');
    //console.log('Selected number is ' + selectedNumber);
    
    var sending = browser.runtime.sendMessage({
      selectedNumber: selectedNumber,
      action: "selectionText"
    });    
    
    //runtime.sendMessage();
  }
});
