
function renderOnOffStatus(onp) {
  document.getElementById('status-on-off').textContent = onp ? 'Now On' : 'Now Off';
}

document.addEventListener('DOMContentLoaded', function() {

    var checkboxOnOff = document.getElementById('checkbox-on-off');
    var checkboxMark = document.getElementById('checkbox-mark');
    var selectPronouns = document.getElementById('select-pronouns');
    var button = document.getElementById('button-reload');

    chrome.storage.local.get("enabled", function(items){
        checkboxOnOff.checked = items.enabled;
        renderOnOffStatus(items.enabled);
    });

    chrome.storage.local.get("mark", function(items){
        checkboxMark.checked = items.mark;
    });

    chrome.storage.local.get("pronouns", function(items){
        selectPronouns.value = items.pronouns || "f";
    });

    checkboxOnOff.addEventListener('change', function(event) {
        chrome.storage.local.set({"enabled": event.target.checked}, function(){
            renderOnOffStatus(event.target.checked);
        });
    });

    checkboxMark.addEventListener('change', function(event) {
        chrome.storage.local.set({"mark": event.target.checked}, function(){});
    });

    selectPronouns.addEventListener('change', function(event) {
        chrome.storage.local.set({"pronouns": event.target.value}, function(){});
    });

    button.addEventListener('click', function(event) {
        chrome.tabs.reload();
    });
});


