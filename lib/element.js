function E(selector) {
    // selector
    var witch;
    var _selector;
    if (selector == null) {
        witch = "null";
        _selector = null;
    } else if (selector instanceof HTMLElement) {
        witch = "Element";
        _selector = null;
    } else if (selector.match(/^#/g)) {
        witch = "ID";
        _selector = selector.replace(/^#/g, "");
    } else if (selector.match(/^<.*>$/g)) {
        witch = "createElement";
        _selector = selector.replace(/^</g, "").replace(/>$/g, "");
    } else {
        witch = "TAG";
        _selector = selector;
    }
    // element
    var e;
    switch (witch) {
        case "Element":
            e = selector;
            break;
        case "ID":
            e = document.getElementById(_selector);
            break;
        case "createElement":
            e = document.createElement(_selector);
            var random = Math.floor(Math.random() * 100000000);
            e.id = "tmp" + random;
            break;
        case "TAG":
            e = document.getElementsByTagName(_selector)[0];
            break;
        default:
            e = document.createElement(null);
            break;
    }
    // done
    this.e = e;
    return this;
}

E.prototype.addClass = function (className) {
    this.e.classList.add(className);
    return this;
};

E.prototype.id = function (id) {
    if (id == null) {
        return this.e.id ? this.e.id : "";
    }
    this.e.id = id;
    return this;
};

E.prototype.text = function (text) {
    if (text == null) {
        return this._getTextNodeValue();
    }
    var textNode = this._getChildTextNode();
    if (textNode) {
        textNode.nodeValue = text;
    } else {
        var newContent = document.createTextNode(text);
        this.e.appendChild(newContent);
    }
    return this;
};

E.prototype._getTextNodeValue = function () {
    var textNode = this._getChildTextNode();
    if (textNode) {
        return textNode.nodeValue;
    } else {
        return "";
    }
};

E.prototype._removeTextNode = function () {
    var textNode = this._getChildTextNode();
    if (textNode) {
        this.e.removeChild(textNode);
    }
};

E.prototype._getChildTextNode = function () {
    if (this.e.hasChildNodes()) {
        var children = this.e.childNodes;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.nodeType == Node.TEXT_NODE) {
                return child;
            }
        }
    }
    return null;
};

E.prototype.val = function (value) {
    if (value == null) {
        return this.e.value;
    } else {
        this.e.value = value;
        return this;
    }
};

E.prototype.attr = function (name, value) {
    this.e.setAttribute(name, value);
    return this;
};

E.prototype.append = function (child) {
    this.e.appendChild(child.e);
    return this;
};

E.prototype.prepend = function (child) {
    this.e.insertBefore(child.e, this.e.firstChild);
    return this;
};

E.prototype.on = function (eventType, func) {
    this.e.addEventListener(eventType, func);
    return this;
};

E.prototype.off = function (eventType, func) {
    this.e.removeEventListener(eventType, func);
    return this;
};

E.prototype.show = function () {
    this.e.style.visibility = "visible";
    return this;
};

E.prototype.hide = function () {
    this.e.style.visibility = "hidden";
    return this;
};

E.prototype.remove = function () {
    this.e.remove();
    return this;
};

E.prototype.fadeIn = function (speed, callback) {
    this.e.style.display = "block";
    this._fadeTo(speed, 0, 1.0, callback);
};

E.prototype.fadeOut = function (speed, callback) {
    this._fadeTo(speed, 1.0, 0, callback);
};

E.prototype._fadeTo = function (speed, initial_opacity, to, callback) {
    var times = 60, count = 0, incremental = (to - initial_opacity) / times, add = 0;
    var _e = this.e;
    _e.style.opacity = initial_opacity;
    var interval = setInterval(function () {
        if (count === times) {
            clearInterval(interval);
            callback();
        }
        add += incremental;
        _e.style.opacity = initial_opacity + add;
        count++;
    }, speed / times);
    return this;
};

E.prototype.hello = function () {
    alert("hello, I'm " + this.id());
    return this;
};