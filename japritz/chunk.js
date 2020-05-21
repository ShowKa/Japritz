class Chunk {
    constructor(kuromojiChunk) {
        console.log(kuromojiChunk.surface_form + ":" + kuromojiChunk.pos);
        this._chunk = kuromojiChunk;
    }
    getSurface() {
        return this._chunk.surface_form;
    }
    isPunctuation() {
        const s = this.getSurface();
        return $.inArray(s, [",", ".", "、", "。"]) >= 0;
    }
    isNoun() {
        return this._chunk.pos === "名詞" && !this.isPunctuation();
    }
    isVerb() {
        return this._chunk.pos === "動詞";
    }
    isNounNumber() {
        return this.isNoun() && this._chunk.pos_detail_1 == "数";
    }
    isPostpositional() {
        return this._chunk.pos === "助詞";
    }
    isConjunction() {
        return this._chunk.pos === "接続詞";
    }
    isPrefix() {
        return this._chunk.pos === "接頭詞";
    }
    isAdverb() {
        return this._chunk.pos === "副詞";
    }
    isDeterminer() {
        return this._chunk.pos === "連体詞";
    }
    isAuxiliaryVerb() {
        return this._chunk.pos === "助動詞";
    }
    isAdjective() {
        return this._chunk.pos === "形容詞";
    }
    isLastOfClause() {
        return this.isPostpositional()
            || this.isConjunction()
            || this.isAdverb()
            || this.isDeterminer()
            || this.isAuxiliaryVerb()
            || this.isPunctuation();
    }
    isIntransitive() {
        return this.isConjunction()
            || this.isVerb()
            || this.isNoun()
            || this.isAdverb()
            || this.isPrefix()
            || this.isAdjective()
            || this.isDeterminer()
    }
}