class Clause {
    constructor(chunks) {
        this._chunks = chunks;
    }
    toString() {
        return this._chunks.map(c => c.getSurface()).join('');
    }
}