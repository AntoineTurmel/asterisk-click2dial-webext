var numberInput = document.querySelector('.number');
var callBtn = document.querySelector('.call');
var settingsBtn = document.querySelector('.settings');
callBtn.addEventListener('click', callNumber);
settingsBtn.addEventListener('click', openSettings);

function hasNumbers(string)
{
  return /\d/.test(string);
}

function callNumber() {
  if (hasNumbers(numberInput.value.toString().trim())) {
    var selectedNumber = numberInput.value.trim().replace(/\+/g, "00").replace(/\D/g,'');
    console.log(selectedNumber);
    var sending = browser.runtime.sendMessage({
      selectedNumber: selectedNumber,
      action: "inputText"
    });
    window.close();
  }
};

function openSettings() {
  browser.runtime.openOptionsPage();
}
