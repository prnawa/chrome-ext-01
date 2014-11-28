var allPages = {};
var crawlStartURL = null;
var startingHost = "";
var startingPage = {};
var appState = "stopped";


var settings = 
{
    get maxDepth() { return 2; },
	get maxSimultaniousCrawls() { return 10; },
	get interestingFileTypes() 
	{ 
		var types = "flv,mk4,ogg,swf,avi,mp3,zip,png,gif,jpg,svg".split(",");
		for (var i in types) { types[i] = $.trim(types[i]);	 }
		return types;
	}
}

function beginCrawl(url)
{	
	reset();	
	appState = "crawling";
	crawlStartURL = url;	
	startingHost = parseUri(url)["protocol"] + "://" + parseUri(url)["host"];
	allPages[url] = {url:url, state:"queued", depth:0, host:startingHost, parsed:parseUri(url)};
	startingPage = allPages[url];
	crawlMore();
}

function crawlPage(page)
{

	page.state = "crawling";
	page.parsed = parseUri(page.url);
	
	console.log("Starting Crawl --> ", page.url);

	var xhr = new XMLHttpRequest();
	xhr.open("GET", page.url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			console.log("Response received from --> ",  page.url);
			onCrawlPageLoaded(page, xhr.responseText);
		}
	}
	xhr.send();
}

function onCrawlPageLoaded(page,data)
{
	alert(page.depth)
	if(page.depth > settings.maxDepth){

		return;
	}
	// Grab all the links on this page
	var links = getAllLinksOnPage(data);	
	
	// We want to count some of the following
	var counts = {roots:0, scripts:0, badProtocols:0, newValids:0, oldValids:0, interestings:0, domWindows:0}
	
	// Loop through each
	$(links).each(function()
	{
		var linkURL = this+"";
		console.log('linkURL', linkURL);
		var absoluteURL = linkURL;	
		var parsed = parseUri(linkURL);
		var protocol = parsed["protocol"];					

		if(linkURL == "[object DOMWindow]")
		{
			counts.domWindows++;
			return true; 
		}
		else if(startsWith(linkURL,"/"))
		{
			 absoluteURL = page.host+"/"+linkURL;
			 counts.roots++;
		}
		else if(protocol=="")
		{
			 absoluteURL = page.url+"/../"+linkURL;
			 counts.roots++;
		}
		else if(protocol=="javascript")
		{
			 //console.log("Not Crawling URL, cannot follow javascript --- "+hrefURL); 
			 counts.scripts++;
			 return true; 
		}		
		else if(protocol!="http" && protocol!="https")
		{
			 //console.log("Not crawling URL, unknown protocol --- "+JSON.stringify({protocol:protocol, url:hrefURL})); 
			 counts.badProtocols++;
			 return true; 
		}
			
		if(!allPages[absoluteURL])
		{			
			// Increment the count
			counts.newValids++;
			
			// Build the page object
			var o = {};
			o.depth = page.depth+1;
			o.url = absoluteURL;
			o.state = page.depth==settings.maxDepth?"max_depth":"queued";
			o.host = parseUri(o.url)["protocol"] + "://" + parseUri(o.url)["host"];
											
			// Get the file extension
			var extn = getFileExt(absoluteURL);

			// Is this an interesting extension?
			if(isInArr(settings.interestingFileTypes,extn)) { return; }

			console.log('page.url, o.url' + page.url + '  '+o.url);
			var rootNode = s.graph.nodes(page.url);
			if(!rootNode){
				s.graph.addNode({
					id: page.url,
					x: Math.random(),
					y: Math.random(),
					size: 1
				});
			}else{
				rootNode.size = rootNode.size + 4;
			};

			s.graph.addNode({
				id: o.url,
				x: Math.random(),
				y: Math.random(),
				size: 1
			});

			s.graph.addEdge({
				id: page.url + o.url,
				source: page.url,
				target: o.url,
				size: 1
			});

			s.refresh();

			allPages[absoluteURL] = o;

		}
		else
		{
			counts.oldValids++;
		}
		
	});
	
	// Debugging is good
	console.log("Page Crawled --> "+JSON.stringify({page:page, counts:counts}));
	
	// This page is crawled
	allPages[page.url].state = "crawled";		
	
	// Check to see if anything else needs to be crawled
	setTimeout(crawlMore, 2000)

	// Render the changes
	//refreshPage();
}

function crawlMore() 
{	
	if(appState!="crawling"){ return; }
	while(getURLsInTab("Crawling").length<settings.maxSimultaniousCrawls && getURLsInTab("Queued").length>0)
	{
		crawlPage(getURLsInTab("Queued")[0]);
	}
}

function getURLsInTab(tab)
{
	var tabUrls = [];	
	for(var ref in allPages) 
	{
		var o = allPages[ref];
		if(tab=="Queued" && o.state=="queued" && !o.isFile){ tabUrls.push(o); }
		else if(tab=="Crawling" && o.state=="crawling"){ tabUrls.push(o); }
		else if(tab=="Crawled" && o.state=="crawled"){ tabUrls.push(o); }
		else if(tab=="Files" && o.isFile){ tabUrls.push(o); }
		else if(tab=="Errors" && o.state=="error"){ tabUrls.push(o); }	
	};		
	return tabUrls;
}

function reset() 
{
	allPages = {};	
}