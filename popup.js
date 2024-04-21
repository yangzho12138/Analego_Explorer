document.addEventListener('DOMContentLoaded', function () {
    var selectNode = document.getElementById('select');

    chrome.storage.sync.get(['switch'], function (result) {
        if (result.switch) {
            selectNode.value = result.switch; 
        }
    });

    selectNode.onchange = function () {
        console.log("selectNode", this.value);
        chrome.storage.sync.set({switch: this.value});

        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            console.log("sendMessage", tabs[0].id, this.value);
            chrome.tabs.sendMessage(tabs[0].id, {switch: this.value});
        });
    };
});
