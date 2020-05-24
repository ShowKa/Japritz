class Paragraphs {
    constructor(str) {
        const paragraphs = str.split(/\n/).filter(s => s.length > 0).map(s => s.trim());
        this._paragraphs = paragraphs;
    }
    get(i) {
        return this._paragraphs[i];
    }
    size() {
        return this._paragraphs.length;
    }
}