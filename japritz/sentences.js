
class Sentences {
    constructor(str) {
        const sentences = str.replace(/\s/g, " ").trim().replace(/\s\s+/g, " ").split(/[。　\s]/);
        for (var i = 0; i < sentences.length; i++) {
            // 空白除去
            if (sentences[i].length == 0) {
                sentences.splice(i, 1);
                // 配列が１つ減るのでindexをカウントダウン
                --i;
                // FIXME "—"の文字コードは？
            } else if (sentences[i].match(/[^\x20-\x7E—]+[\x20-\x7E]+$/)) {
                // 英数字で終わる場合は、1つ後の配列と統合
                if (sentences[i + 1]) {
                    sentences[i] = sentences[i] + " " + sentences[i + 1];
                    sentences.splice(i + 1, 1);
                    // 連結後配列（自分自身）をもう一度調べるために、カウントダウン
                    --i;
                }
            }
        }
        this._sentences = sentences;
    }
    get(i) {
        return this._sentences[i];
    }
    size() {
        return this._sentences.length;
    }
}