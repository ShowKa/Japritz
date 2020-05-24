class Clause {
    constructor(chunkList) {
        this._chunkList = chunkList;
    }
    isEnd() {
        const last = this._chunkList[this._chunkList.length - 1];
        return last.match(/[.?!。！？]$/);
    }
    toString() {
        return this._chunkList.map(c => c.getSurface()).join('');
    }
}