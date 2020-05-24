chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // 関数間で共有させたい変数たち
    var sharedQ = new Queue();
    var interval;
    // make box
    const $container = $("<div>").attr("id", "japritzContainer");
    const $box = $("<div>").text("Start Japritz");
    const $close = $("<div>").attr("id", "japritzClose").text("×");
    // functions
    function display() {
        if (sharedQ.size() > 0) {
            $box.text(sharedQ.dequeue());
            return;
        }
        destroyDisplay();
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
        $container.fadeOut("fast", function () {
            $(this).remove();
        });
        // 共有変数初期化  多分意味ない。
        delete sharedQ, interval, $container, $box, $close;
    }
    // 最初に間を入れる
    sharedQ.enqueue("");
    // main
    var paragraphs = new Paragraphs($.selection());
    paragraphs.forEach(para => {
        // tokenize
        const kuromojiChunks = tokenizer.tokenize(para.toString());
        const chunks = new Chunks(kuromojiChunks.map(c => new Chunk(c)));
        const clauses = chunks.getClauses();
        clauses.forEach(c => {
            sharedQ.enqueue(c.toString())
            if (c.isEnd()) {
                sharedQ.enqueue("");
            }
        });
    });
    // add box into dom
    $close.on("click", destroyDisplay);
    $container.append($box);
    $container.append($close);
    $("body").append($container);
    $container.fadeIn("slow", function () {
        interval = setInterval(display, speed);
        // stop or restart
        $container.on("click", stopDisplay);
    });
});
