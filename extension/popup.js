
function renderOnOffStatus(onp) {
  document.getElementById('status-on-off').textContent = onp ? 'Now On' : 'Now Off';
}

document.addEventListener('DOMContentLoaded', function() {

    var checkboxOnOff = document.getElementById('checkbox-on-off');
    var checkboxMark = document.getElementById('checkbox-mark');
    var button = document.getElementById('button');

    chrome.storage.local.get("enabled", function(items){
        checkboxOnOff.checked = items.enabled;
        renderOnOffStatus(items.enabled);
    });

    chrome.storage.local.get("mark", function(items){
        checkboxMark.checked = items.mark;
    });

    checkboxOnOff.addEventListener('change', function(event) {
        chrome.storage.local.set({"enabled": event.target.checked}, function(){
            renderOnOffStatus(event.target.checked);
        });
    });

    checkboxMark.addEventListener('change', function(event) {
        chrome.storage.local.set({"mark": event.target.checked}, function(){});
    });

    button.addEventListener('click', function(event) {
        chrome.tabs.reload();
    });
});


