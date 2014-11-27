var dashBoardUrl = chrome.extension.getURL('dashboard.html');


chrome.browserAction.onClicked.addListener(function(tab) { //Fired when User Clicks ICON
	chrome.tabs.query({
		url: dashBoardUrl
	}, function(tabs) {
		var tabId;
		if (tabs.length) {
			tabId = tabs[0].id;
			chrome.tabs.update(tabs[0].id, {
				active: true
			}, function (tabb){
				chrome.tabs.sendMessage(tabb.id, tab.url);
			});
		} else {
			chrome.tabs.create({
				url: dashBoardUrl
			}, function (tabb){
				chrome.tabs.sendMessage(tabb.id, tab.url);
			});
		}
	});
});