var selectedNumber = null;
var asteriskServer = null;
var asteriskPort = null;
var asteriskUsername = null;
var asteriskPassword = null;
var asteriskContext = null;
var asteriskProtocol = null;
var asteriskChannel = null;

var getting = browser.storage.local.get("asterisk");
getting.then(getOptions, onError);

function getOptions(result) {
  //console.log(result);
  asteriskServer = result.asterisk.server || "localhost";
  asteriskPort = result.asterisk.port || "8088";
  asteriskUsername = result.asterisk.username || "admin";
  asteriskPassword = result.asterisk.password || "";
  asteriskContext = result.asterisk.context || "default";
  asteriskProtocol = result.asterisk.protocol || "";
  asteriskChannel = result.asterisk.channel || "";
}

function onError(error) {
  console.log(`Error: ${error}`);
}

/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    //console.log("Item created successfully");
  }
}
  
/*
Called when the item has been removed.
We'll just log success here.
*/
function onRemoved() {
  //console.log("Item removed successfully");
}

function createMenuItem(number){
  browser.menus.create({
    id: "callnumber",
    type: "normal",
    title: "Call: " + number,
    contexts: ["selection","editable"],
    checked: true,
    icons: {
      "20": "icons/asterisk-20.png",
      "32": "icons/asterisk-32.png"
    }
  }, onCreated);
  browser.menus.create({
    id: "editcallnumber",
    type: "normal",
    title: "Edit and call: " + number,
    contexts: ["selection","editable"],
    checked: true,
    icons: {
      "20": "icons/asterisk-20.png",
      "32": "icons/asterisk-32.png"
    }
  }, onCreated);
}
  
function handleMessage(request, sender, sendResponse) {
  //console.log("Message from the content script: " + request.selectedNumber);
  selectedNumber = request.selectedNumber;
  //sendResponse({response: "Response from background script"});
  browser.menus.remove("callnumber");
  browser.menus.remove("editcallnumber");
  createMenuItem(request.selectedNumber);
}

browser.runtime.onMessage.addListener(handleMessage);

browser.menus.onClicked.addListener((info, tab) => {
  getting = browser.storage.local.get("asterisk");
  getting.then(getOptions, onError);
  switch (info.menuItemId) {
    case "callnumber":
      //console.log("Calling X number");
      let xhr_login = new XMLHttpRequest();
      let xhr = new XMLHttpRequest();
      xhr_login.open("GET", "http://" + asteriskServer + ":" + asteriskPort + "/asterisk/mxml?action=Login&Username=" + asteriskUsername + "&Secret=" + asteriskPassword);
      xhr_login.send("");
      xhr_login.onreadystatechange = function() {
          if (xhr_login.readyState == 4 && (xhr_login.status == 200 || xhr_login.status == 0)) {
              console.log(xhr_login.responseText);
              var response = xhr_login.responseXML;
              var success = response.getElementsByTagName("generic")[0].getAttribute('response')
              //console.log(success);
              if (success == "Success") {
                xhr.open("GET", "http://" + asteriskServer + ":" + asteriskPort + "/asterisk/mxml?action=originate&channel=" + asteriskProtocol + "/" + asteriskChannel + "&exten=" + selectedNumber + "&context=" + asteriskContext + "&CallerId=" + asteriskChannel + "&priority=1&codecs=alaw&timeout=5000");
                xhr.send("");
              }
              else {
                  console.log("Bad authentification, check your credentials");
              }
          }
      };
      xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
              console.log(xhr.responseText);
          }
      };
      break;
    case "editcallnumber":
    var person = prompt("Please enter your number", "123");
      break;
  }
});

/* browser.browserAction.onClicked.addListener((handleClick) => {
    selection = window.getSelection().toString().trim();
    console.log(selection);
    function onGot(tabInfo) {
        console.log(tabInfo[0].id);

        browser.tabs.sendMessage(tabInfo[0].id, {action:"getSelection"})
        .then(response => {
            console.log(response.response);
        });

      }
      
      function onError(error) {
        console.log(`Error: ${error}`);
      }
      
      var gettingCurrent = browser.tabs.query({active: true});
      gettingCurrent.then(onGot, onError);

}); */
