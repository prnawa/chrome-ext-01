var dashboard = document.getElementById('dashboard');

chrome.storage.local.get(null, function(items) {
	var allKeys = Object.keys(items);
	for (var i = allKeys.length - 1; i >= 0; i--) {
		var key = allKeys[i];
		var aTag = document.createElement('a');
		var imgTag = document.createElement('img');
		aTag.setAttribute('href', key);
		imgTag.setAttribute('src', items[key]);
		imgTag.setAttribute('style', "max-height: 200px; max-width: 300px;");
		aTag.appendChild(imgTag);
		dashboard.appendChild(aTag);
	};
});