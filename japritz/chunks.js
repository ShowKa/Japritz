class Chunks {
    constructor(chunks) {
        this._chunks = chunks;
    }
    size() {
        return this._chunks.length;
    }
    get(i) {
        return this._chunks[i];
    }
    getClauses() {
        const clauses = [];
        var clauseElements = [];
        for (var i = 0; i < this.size(); i++) {
            // chunk
            const chunk = this.get(i);
            clauseElements.push(chunk);
            // next
            const next = (i <= this.size() - 1) ? this.get(i + 1) : null;
            if (!next) {
                clauses.push(new Clause(clauseElements));
                break;
            }
            // 名詞(句読点除く)が続く場合、熟語として扱う。
            // 接頭詞 + 名詞の場合も同様。
            // よって文節は区切らない
            if ((chunk.isNoun() || chunk.isPrefix()) && next.isNoun()) {
                continue;
            }
            // 自立語の場合, 文節を切る。
            if (next.isIntransitive()) {
                clauses.push(new Clause(clauseElements));
                clauseElements = [];
            }
        }
        return clauses;
    }
}