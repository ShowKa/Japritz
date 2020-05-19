// get speed from option
var speed;
chrome.storage.sync.get({
    speed: 350
}, function(items) {
    speed = items.speed;
});
