function saveOptions(e) {
  e.preventDefault();
  var server = document.querySelector("#server").value;
  var port = document.querySelector("#port").value;
  var username = document.querySelector("#username").value;
  var password = document.querySelector("#password").value;
  var context = document.querySelector("#context").value;
  var protocol = document.querySelector("#protocol").value;
  var channel = document.querySelector("#channel").value;
  browser.storage.local.set({
    asterisk: {server: server, port: port, username:username, password:password, context:context,protocol:protocol,channel:channel}
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    //console.log(result);
    document.querySelector("#server").value = result.asterisk.server || "localhost";
    document.querySelector("#port").value = result.asterisk.port || "8088";
    document.querySelector("#username").value = result.asterisk.username || "admin";
    document.querySelector("#password").value = result.asterisk.password || "";
    document.querySelector("#context").value = result.asterisk.context || "default";
    document.querySelector("#protocol").value = result.asterisk.protocol || "";
    document.querySelector("#channel").value = result.asterisk.channel || "";
  }

  function onError(error) {
    //console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("asterisk");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
