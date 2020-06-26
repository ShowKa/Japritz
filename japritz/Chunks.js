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
            // flag
            var separateClause = false;
            // chunk
            const chunk = this.get(i);
            clauseElements.push(chunk);
            // next
            const next = (i <= this.size() - 1) ? this.get(i + 1) : null;
            if (!next) {
                clauses.push(new Clause(clauseElements));
                break;
            }
            // prev
            const prev = (i > 0) ? this.get(i - 1) : null;
            // 開括弧の場合、文節は区切らない
            if (chunk.isParenthesisStart()) {
                continue;
            }
            // 接頭詞 + 名詞の場合、文節は区切らない
            // 例：お買い物
            if (chunk.isPrefix() && next.isNoun()) {
                continue;
            }
            // 接頭詞 + 動詞の場合も、文節は区切らない。
            // 例：お読みに...
            if (chunk.isPrefix() && next.isVerb()) {
                continue;
            }
            // サ変接続名詞 + するの場合、文節は区切らない
            // 例：発表する
            if (chunk.isVerbalNoun() && next.isNominalVerb()) {
                continue;
            }
            // 接尾動詞が続く場合、文節は区切らない
            if (next.isVerbSuffix()) {
                continue;
            }
            // 句読点の場合
            if (chunk.isPunctuation()) {
                // 前が数詞の場合、文節を切らない。
                if (prev && prev.isNounNumber()) {
                    continue;
                }
                // 上記以外の場合、文節を切る。
                separateClause = true;
            }
            // 閉じ括弧の場合、文節を区切る。
            if (!separateClause && chunk.isParenthesisEnd()) {
                separateClause = true;
            }
            // 自立語が続く場合, 文節を切る。
            if (!separateClause && next.isStartOfClause()) {
                separateClause = true;
            }
            // 文節区切
            if (separateClause) {
                clauses.push(new Clause(clauseElements));
                clauseElements = [];
                continue;
            }
        }
        return clauses;
    }
}