chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // 関数間共有変数
    const speed = msg.speed;
    const sharedQ = new Queue();
    var interval;
    // make box
    const $container = new E("<div>").attr("id", "japritzContainer");
    const $box = new E("<div>").text("Start Japritz");
    const $close = new E("<div>").attr("id", "japritzClose").text("×");
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
        $container.remove();
    }
    // 最初に間を入れる
    sharedQ.enqueue("");
    // main
    const selected = window.getSelection().toString();
    var paragraphs = new Paragraphs(selected);
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
    new E("body").prepend($container);
    $container.fadeIn(600, function () {
        $container.on("click", stopDisplay);
        interval = setInterval(display, speed);
    });
});
