// browser button
chrome.browserAction.onClicked.addListener(function (tab) {
	callJapritz(tab);
});
// 右クリック contextmenus
chrome.contextMenus.create({
	"title": "Japritz",
	"contexts": ["selection"],
	onclick: function (info, tab) {
		callJapritz(tab);
	}
});
// load tokenizer
var dictUrl = chrome.extension.getURL("lib/dict/");
var tokenizer;
kuromoji.builder({ dicPath: dictUrl }).build(function (err, _tokenizer) {
	tokenizer = _tokenizer;
});
// 起動
function callJapritz(tab) {
	// get option
	chrome.storage.sync.get({
		speed: 350
	}, function (items) {
		// send
		chrome.tabs.sendMessage(tab.id, {
			speed: items.speed
		}, null);
	});
}
