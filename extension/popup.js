
function renderStatus(onOrOff) {
  document.getElementById('status').textContent = onOrOff ? 'Now On' : 'Now Off';
}

document.addEventListener('DOMContentLoaded', function() {

    var checkbox = document.getElementById('checkbox');
    var button = document.getElementById('button');

    chrome.storage.local.get("enabled", function(items){
        checkbox.checked = items.enabled;
        renderStatus(items.enabled);
    });

    checkbox.addEventListener('change', function(event) {
        chrome.storage.local.set({"enabled": event.target.checked}, function(){
            renderStatus(event.target.checked);
        });
    });

    button.addEventListener('click', function(event) {
        chrome.tabs.reload();
    });
});


