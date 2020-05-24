var dictUrl = chrome.extension.getURL("lib/dict/");
var tokenizer;
kuromoji.builder({ dicPath: dictUrl }).build(function(err, _tokenizer) {
    tokenizer = _tokenizer;
});
