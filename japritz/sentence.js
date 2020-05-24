class Sentence {
    constructor(str) {
        // this._str = str.replace(/、/g, comma) + ".";
        this._str = str;
    }
    toString() {
        return this._str;
    }
    isAlphaNumeric() {
        return this._str.match(/^[\x20-\x7E]+$/);
    }
    isEnd() {
        this._str.match(/[.?!]$/);
    }
}