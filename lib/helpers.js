function parseUri (str) 
{
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};

parseUri.options = 
{
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

function startsWith(s, str){
    return (s.indexOf(str) === 0);
}

function getFileExt(filename) 
{
	return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined; 
}

function getAllLinksOnPage(page)
{
	var links = new Array();	
	$(page).find('[src]').each(function(){ links.push($(this).attr('src')); });	
	$(page).find('[href]').each(function(){ links.push($(this).attr('href')) });	
	return links;
}

/*
function getInterestingFileTypes()
{
	var types = (localStorage["interesting-file-types"]?localStorage["interesting-file-types"]:"flv,mk4,avi,mp3,zip,png,gif,jpg").split(",");
	for (var i in types) { types[i] = $.trim(types[i]);	 }
	return types;
}
*/

function isInArr(arr,val)
{
	for (var i in arr)
	{
		if(arr[i]==val){ return true; }
	}
	return false;
}

String.prototype.hashCode = function() {
	var hash = 0, i, chr, len;
	if (this.length == 0) return hash;
	for (i = 0, len = this.length; i < len; i++) {
		chr   = this.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};