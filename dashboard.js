/**
 * This is a basic example of how a classic svg renderer renders the exact same way
 * than its canvas counterparts.
 */
//chrome.tabs.getCurrent(function(tab){
//	console.log(tab.url);
//})

chrome.runtime.onMessage.addListener(function(url) {
	beginCrawl(url);
});

var	s = new sigma(),
	cam = s.addCamera();


// Initialize two distinct renderers, each with its own settings:
s.addRenderer({
	container: document.getElementById('graph-container'),
	type: 'svg',
	camera: cam,
	settings: {
		hideEdgesOnMove: false	,
		defaultLabelColor: '#fff',
		defaultNodeColor: '#999',
		defaultEdgeColor: '#333',
		edgeColor: 'default'
	}
});
