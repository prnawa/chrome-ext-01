chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
	var dashBoardUrl = chrome.extension.getURL('dashboard.html');

	chrome.tabs.query({url: dashBoardUrl}, function(tabs) {
	    if (tabs.length) {
	        chrome.tabs.update(tabs[0].id, {active: true});
	    } else {
	        chrome.tabs.create({url: dashBoardUrl});
	    }
	});
});