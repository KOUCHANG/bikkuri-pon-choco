// ページが読み込まれたら実行
window.onload = function() {
    const randomImage = document.getElementById('random-image');
    const retryButton = document.getElementById('retry-button'); // ボタンを取得

    // 🖼️ ここに `images` フォルダに入れた画像ファイル名を追加してください
    const images = [
        'images/image1.png',
        'images/image2.png',
        'images/image3.png',
        'images/image4.png',
        'images/image5.png',
        'images/image6.png',
    ];

    // ✨ パッケージ画像のパスを指定 (例: imagesフォルダに package.png を配置)
    const packageImage = 'images/package.png';

    // --- 設定項目 ---
    const shuffleDuration = 3000; // シャッフルアニメーションの時間 (3秒)
    const shuffleInterval = 100;  // 画像が切り替わる速さ (0.1秒)
    // ----------------

    let shuffleTimer; // shuffleTimerをグローバルスコープに移動

    // ===== 初期表示: パッケージ画像 =====
    randomImage.src = packageImage;

    // シャッフルと結果表示のコア処理
    function executeShuffleSequence() {
        // 画像が1枚以下の場合は、シャッフル処理をせずにエラーを回避する
        if (images.length <= 1) {
            if (images.length === 1) {
                randomImage.src = images[0];
            }
            retryButton.style.display = 'block'; // 画像が1枚でも「もう1度引く」は表示（ただし動作は変わらない）
            retryButton.disabled = false;
            return;
        }

        retryButton.style.display = 'none'; // シャッフル中はボタンを隠す
        retryButton.disabled = true;      // シャッフル中はボタンを無効化

        startShuffle();
        setTimeout(stopShuffle, shuffleDuration);
    }

    // ===== 画像クリック/タップでシャッフル処理を開始 =====
    randomImage.addEventListener('click', () => {
        // パッケージ画像が表示されている最初のクリック時のみ反応するようにする
        if (randomImage.src.endsWith(packageImage)) {
             executeShuffleSequence();
        }
    }, { once: true }); // このイベントリスナーは一度だけ実行

    // ===== 「もう1度引く」ボタンのクリック処理 =====
    retryButton.addEventListener('click', () => {
        if (!retryButton.disabled) { // ボタンが有効な場合のみ実行
            executeShuffleSequence();
        }
    });


    // シャッフルアニメーションを開始する関数
    function startShuffle() {
        let lastIndex = -1;
        shuffleTimer = setInterval(() => {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * images.length);
            } while (randomIndex === lastIndex && images.length > 1);
            randomImage.src = images[randomIndex];
            lastIndex = randomIndex;
        }, shuffleInterval);
    }

    // シャッフルを停止して最終的な画像を表示する関数
    function stopShuffle() {
        clearInterval(shuffleTimer);

        const finalImageIndex = Math.floor(Math.random() * images.length);
        randomImage.src = images[finalImageIndex];

        // 画像決定エフェクト
        document.body.classList.add('image-decided-effect');
        setTimeout(() => {
            document.body.classList.remove('image-decided-effect');
        }, 500);

        retryButton.style.display = 'block'; // シャッフル後にボタンを表示
        retryButton.disabled = false;     // ボタンを有効化
    }
};