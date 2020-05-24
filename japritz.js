chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // 関数間共有変数
    const sharedQ = new Queue();
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
        $container.off("click", stopDisplay).on("click", restartDisplay);
    }
    function restartDisplay() {
        interval = setInterval(display, speed);
        $container.off("click", restartDisplay).on("click", stopDisplay);
    }
    function destroyDisplay() {
        clearInterval(interval);
        $container.fadeOut("fast", function () {
            $(this).remove();
        });
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
