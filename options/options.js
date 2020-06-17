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
        show_speed();
    });
}

function show_speed() {
    var e = document.getElementById('speed');
    var speed = parseInt(e.value);
    var max = parseInt(e.max);
    var min = parseInt(e.min);
    var span = (max - min) / 4
    var message;
    if (min <= speed && speed < min + span) {
        message = "爆速";
    } else if (min + span <= speed && speed < min + span * 2 ) {
        message = "速い";
    } else if (min + span * 2 <= speed && speed < min + span * 3) {
        message = "普通";
    } else if (min + span * 3 <= speed && speed <= max) {
        message = "遅い";
    } else {
        message = "　";
    }
    document.getElementById('speed_meter').innerHTML = message;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('speed').addEventListener('change', show_speed);