// save
function save_options() {
    var speed = document.getElementById('speed').value;
    chrome.storage.sync.set({
        speed: speed
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '　';
        }, 1500);
    });
}

// Restores select box and textbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        speed: 350
    }, function(items) {
        document.getElementById('speed').value = items.speed;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);