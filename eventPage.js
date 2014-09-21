var dashBoardUrl = chrome.extension.getURL('dashboard.html');

var switchToDashBoard = function(tabs) {

	if (tabs.length) {
		chrome.tabs.update(tabs[0].id, {
			active: true
		});
	} else {
		chrome.tabs.create({
			url: dashBoardUrl
		});
	}
};

function resizeImage(url, width, height, callback) {
	var sourceImage = new Image();

	sourceImage.onload = function() {
		// Create a canvas with the desired dimensions
		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		// Scale and draw the source image to the canvas
		canvas.getContext("2d").drawImage(sourceImage, 0, 0, width, height);

		// Convert the canvas to a data URL in PNG format
		callback(canvas.toDataURL());
	}

	sourceImage.src = url;
}

chrome.browserAction.onClicked.addListener(function(tab) { //Fired when User Clicks ICON
	// Save it using the Chrome extension storage API.
	chrome.tabs.captureVisibleTab(function(screenshotUrl) {
		//resizeImage(screenshotUrl, 300, 200, function(resizedImageUrl) {
			var object = {};
			object[tab.url] = screenshotUrl;
			chrome.storage.local.set(object, function() {
				chrome.tabs.query({
					url: dashBoardUrl
				}, switchToDashBoard);
			});
		//})
	});
});