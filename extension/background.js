
var enabled = true;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.msg == "ready?") {
      sendResponse(enabled ? {msg: true} : {msg: false});
    }
  }
);
