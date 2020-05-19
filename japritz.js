
var dictUrl = chrome.extension.getURL("lib/dict/");

// 句読点
var comma = ",";
var period = ".";
var punctuation = [comma, period];

// 詞
var conjunction = "接続詞";
var verb = "動詞";
//var auxiliaryVerb = "助動詞";
var noun = "名詞";
var prefix = "接頭詞";
var adverb = "副詞";
var adjective = "形容詞";
var determiner = "連体詞";
var continuous = "連用形";
// 自立語
var intransitive = [conjunction, verb, noun, adverb, prefix, adjective, determiner];
// 括弧開
var parenthesisStart = ["[", "(", "（", "「"];
// 数
var number = "数";

var tokenizer;
kuromoji.builder({ dicPath: dictUrl }).build(function(err, _tokenizer) {
    tokenizer = _tokenizer;
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    // 関数間で共有させたい変数たち
    var sharedQ = new Queue();
    var end = false;
    var interval;

    // make box
    var $container = $("<div>").attr("id", "japritzContainer");
    var $box = $("<div>").text("Start Japritz");
    var $close = $("<div>").attr("id", "japritzClose").text("×");

    function japritz() {

        var section = $.selection().replace(/\s/g, " ").trim().replace(/\s\s+/g, " ").split(/[。　\s]/);

        for (var i = 0; i < section.length; i++) {
            // 空白除去
            if (section[i].length == 0) {
                section.splice(i, 1);
                // 配列が１つ減るのでindexをカウントダウン
                --i;

                // FIXME "—"の文字コードは？
            } else if (section[i].match(/[^\x20-\x7E—]+[\x20-\x7E]+$/)) {
                // 英数字で終わる場合は、1つ後の配列と統合
                if (section[i + 1]) {
                    section[i] = section[i] + " " + section[i + 1];
                    section.splice(i + 1, 1);

                    // 連結後配列（自分自身）をもう一度調べるために、カウントダウン
                    --i;
                }
            }
        }

        var getWords = function(l) {

            // 半角英数字のみの場合は、APIアクセスは不要。
            // queueに文字列ぶっこんで、再帰呼び出し。
            if (section[l].match(/^[\x20-\x7E]+$/)) {
                sharedQ.enqueue(section[l]);
                // ピリオドやクエスチョンで終わる場合は、文末とみなす
                // 文末の場合は、間を入れる。
                if (section[l].match(/[.?!]$/)) {
                    sharedQ.enqueue("");
                }
                // 再帰呼び出し
                recrusive(l);
                return;
            }

            // 置換。
            var sentence = section[l].replace(/、/g, comma);

            // ピリオドで文章を終わらせる。
            sentence += period;

            // tokenize
            var tokenized = tokenizer.tokenize(sentence);
            var dispText = "";
            var added = false;

            // 括弧開きが発生したか否か
            var pStart = false;

            $.each(tokenized, function(i, chunk) {
                var surface = chunk.surface_form;
                dispText += surface;
                added = false;

                // 括弧開きが発生した場合は、文節区切りをせず、次のchunkの判定にうつる。
                if (pStart) {
                    pStart = false;
                    return true;
                }

                var nextChunk = null;
                if ((i + 1) < tokenized.length) {
                    nextChunk = tokenized[i + 1];    
                }

                // 句読点が来た場合は文節区切りとみなす。
                if (isPunctuation(chunk)) {

                    // ただし、前後に数詞が来る場合は文節区切りしない。
                    if (nextChunk && (i > 0 && isNumber(tokenized[i - 1])) && isNumber(nextChunk)) {
                        return true;
                    }

                    // 文節区切り！
                    sharedQ.enqueue(dispText);
                    dispText = "";
                    added = true;
                    return true;
                }

                // 次に括弧開が来る場合も文節区切り
                if (nextChunk && $.inArray(nextChunk.surface_form, parenthesisStart) >= 0) {
                    // 文節区切り！
                    sharedQ.enqueue(dispText);
                    dispText = "";
                    added = true;

                    pStart = true;

                    return true;
                }

                // 次のchunkが自立語なら文節を区切る
                if (nextChunk) {
                    if (isNoun(chunk) && isNoun(nextChunk)) {
                        // 名詞は自立語だが、名詞が連続する場合は熟語とみなし、まだ文節区切りを行なわない
                        return true;
                    }
                    if (isIntransitive(nextChunk)) {
                        // 文節区切り！
                        sharedQ.enqueue(dispText);
                        dispText = "";
                        added = true;
                    }
                }
            });

            if (!added) {
                sharedQ.enqueue(dispText);
                dispText = "";
            }

            // 文章に間を設ける
            sharedQ.enqueue("");
            // 再帰呼出し    
            recrusive(l);
        }

        // 最初に間を入れる
        sharedQ.enqueue("");
        getWords(0);

        // add box into dom
        $close.on("click", destroyDisplay);
        $container.append($box);
        $container.append($close);
        $("body").prepend($container);
        $container.fadeIn("slow", function() {
            interval = setInterval(display, speed);
            // stop or restart
            $container.on("click", stopDisplay);
        });

        // 再帰呼び出し
        function recrusive(l) {
            if (l < section.length - 1) {
                getWords(l + 1);
            } else {
                end = true;
            }
        }
    }

    // 句読点か否か
    function isPunctuation(chunk) {
        if ($.inArray(chunk.surface_form, punctuation) >= 0) {
            return true;
        }
        return false;
    }
    // 数詞であるか否か
    function isNumber(chunk) {
        if (chunk.pos == noun && chunk.pos_detail_1 == number) {
            return true;
        }
        return false;
    }
    // 名詞か否か
    function isNoun(chunk) {
        // 名詞だけでなく接頭詞も名詞とみなす。
        if ($.inArray(chunk.pos, [noun, prefix]) >= 0) {
            return true;
        }
        return false;
    }

    // 自立語であるか否か
    function isIntransitive (chunk) {
        // 自立語である。
        if ($.inArray(chunk.pos, intransitive) >= 0) {

            if (chunk.pos_detail_1 == "自立") {
                return true;
            }

            // 名詞や動詞でも非自立の場合は、自立語とはみなさない
            if (chunk.pos_detail_1 == "非自立") {
                return false;
            }

            // 句読点の場合も自立語ではない（句読点も名詞として定義されている）
            if (isPunctuation(chunk)) {
                return false;
            }

            // 動詞でも、連用形の場合は自立語とはみなさない。
            if (chunk.pos == verb && chunk.conjugated_form == continuous) {
                return false;
            }

            return true;
        }
        return false;
    }

    function display() {
        if (sharedQ.size() > 0) {
            // next
            $box.text(sharedQ.dequeue());
        } else if (end === true && sharedQ.size() == 0) {
            // Japritz表示の終了処理
            destroyDisplay();
        }
    }

    function stopDisplay() {
        clearInterval(interval);
        // toggle
        $container.off("click", stopDisplay).on("click", restartDisplay);
    }

    function restartDisplay() {
        interval = setInterval(display, speed);
        // toggle
        $container.off("click", restartDisplay).on("click", stopDisplay);
    }

    function destroyDisplay() {
        // interval止める
        clearInterval(interval);
        $container.fadeOut("fast", function() {
            $(this).remove();
        });

        // 共有変数初期化  多分意味ない。
        delete sharedQ, interval, end, $container, $box, $close;
    }

    // do it!!
    japritz();
});