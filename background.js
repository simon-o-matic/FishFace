var successURL = "https://www.facebook.com/connect/login_success.html"

function onFacebookLogin() {
    chrome.tabs.getAllInWindow(null, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].url.indexOf(successURL) == 0) {
                localStorage.fishbowl = tabs[i].url.match(/access_token=([^&]+)/)[1];
                chrome.tabs.onUpdated.removeListener(onFacebookLogin);
                return;
            }
        }
    });
}

function listenForFacebookLogin() {
    chrome.tabs.onUpdated.addListener(onFacebookLogin);
}