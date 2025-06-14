// ページが読み込まれたら実行
window.onload = function() {
    const randomImage = document.getElementById('random-image');
    const actionButton = document.getElementById('action-button');
    const imageCountDisplay = document.getElementById('image-count-display');

    // 🖼️ 画像データは image-data.js から allImagesData を参照
    const images = allImagesData; // ← 変更

    // ✨ パッケージ画像のパスを指定
    const packageImage = 'images/package.png';

    // --- 設定項目 ---
    const shuffleDuration = 3000; // シャッフルアニメーションの時間 (3秒)
    const shuffleInterval = 100;  // 画像が切り替わる速さ (0.1秒)
    // ----------------

    let shuffleTimer;

    // ===== 初期表示: パッケージ画像とスタートボタン、種類数 =====
    randomImage.src = packageImage;
    actionButton.textContent = 'スタート';
    actionButton.style.display = 'block';
    actionButton.disabled = false;

    // 画像の種類数を表示
    if (imageCountDisplay) { // 要素が存在する場合のみ処理
        imageCountDisplay.textContent = `（全${images.length}種類）`; // 全角丸括弧で囲む
    }

    // 重みを考慮してランダムな画像のインデックスを取得するヘルパー関数
    function getWeightedRandomIndex(weightedImages) {
        const totalWeight = weightedImages.reduce((sum, img) => sum + (img.weight || 0), 0);
        if (totalWeight <= 0) return Math.floor(Math.random() * weightedImages.length); // 重みが無効な場合は通常のランダム

        let randomNumber = Math.random() * totalWeight;
        for (let i = 0; i < weightedImages.length; i++) {
            if (randomNumber < (weightedImages[i].weight || 0)) {
                return i;
            }
            randomNumber -= (weightedImages[i].weight || 0);
        }
        // フォールバック (通常は到達しないが、浮動小数点誤差などを考慮)
        return weightedImages.length - 1;
    }

    // シャッフルと結果表示のコア処理
    function executeShuffleSequence() {
        document.body.classList.remove('image-decided-effect');

        if (images.length === 0) { // 画像が0枚の場合
            actionButton.textContent = '画像なし';
            actionButton.disabled = true;
            return;
        }

        if (images.length === 1) { // 画像が1枚だけの場合
            randomImage.src = images[0].src; // .src を追加
            actionButton.textContent = 'もう1度引く';
            actionButton.disabled = false; // 1枚でも再度引けるようにする（結果は同じ）
            document.body.classList.add('image-decided-effect');
            return;
        }

        actionButton.disabled = true;
        actionButton.textContent = 'シャッフル中...';

        startShuffle();
        setTimeout(stopShuffle, shuffleDuration);
    }

    actionButton.addEventListener('click', () => {
        if (!actionButton.disabled) {
            executeShuffleSequence();
        }
    });

    function startShuffle() {
        let lastIndex = -1;
        shuffleTimer = setInterval(() => {
            let randomIndex;
            // シャッフル中は重みを考慮せず、均等にランダム選択
            // images.length > 1 の条件は executeShuffleSequence で担保済み
            do {
                randomIndex = Math.floor(Math.random() * images.length);
            } while (randomIndex === lastIndex);

            randomImage.src = images[randomIndex].src;
            lastIndex = randomIndex;
        }, shuffleInterval);
    }

    function stopShuffle() {
        clearInterval(shuffleTimer);

        // 最終的な画像は重みを考慮して決定
        const finalImageIndex = getWeightedRandomIndex(images);
        randomImage.src = images[finalImageIndex].src;

        document.body.classList.add('image-decided-effect');

        actionButton.textContent = 'もう1度引く';
        actionButton.disabled = false;
    }
};
