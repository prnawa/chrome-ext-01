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
var i,
	N = 10,
	E = 5,
	s = new sigma(),
	cam = s.addCamera();

// Generate a random graph:
for (i = 0; i < N; i++)
	s.graph.addNode({
		id: 'n' + i,
		label: 'Node ' + i,
		x: Math.random(),
		y: Math.random(),
		size: 1
	});

var j = 0;
setInterval(function(){
	var rand1 = Math.random() * N | 0;
	var rand2 = Math.random() * N | 0;
	s.graph.addEdge({
		id: 'e' + j,
		source: 'n' + rand1,
		target: 'n' + rand2,
		size: 1
	});
	var nodet = s.graph.nodes('n' + rand2);
	nodet.size = nodet.size + 4;
	nodet.label =  'Node ' + nodet.size,
		j++;
	s.refresh();
}, 1000);


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

// s.bind(s.events, function(e) {
//   console.log(e);
// });

// Refresh the instance to refresh the new renderers:
s.refresh();