// 起動
function callJapritz(tab) {
	chrome.tabs.sendMessage(tab.id, {
		text: "report_back"
	}, null);
}

// browser button
chrome.browserAction.onClicked.addListener(function(tab) {
	callJapritz(tab);
});

// 右クリック contextmenus
chrome.contextMenus.create({
	"title": "Japritz",
	"contexts": ["selection"],
	onclick: function(info, tab) {
		callJapritz(tab);
	}
});