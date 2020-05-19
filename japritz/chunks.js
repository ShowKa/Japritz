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
            const chunk = this.get(i);
            // const next = (i <= this.size() - 1) ? this.get(i + 1) : null;
            // const prev = (i > 0) ? this.get(i - 1) : null;
            clauseElements.push(chunk);
            if (chunk.isLastOfClause()) {
                clauses.push(new Clause(clauseElements));
                clauseElements = [];
            }
        }
        if (clauseElements.length > 0) {
            clauses.push(new Clause(clauseElements));
        }
        return clauses;
    }
}