/**
 * Lab 2 - 照相亭 (Photo Booth)
 * Camera access → 3-shot burst with countdown → gallery → download strip
 */
document.addEventListener('DOMContentLoaded', () => {
    // ── DOM refs ──────────────────────────────────────
    const btnStartCamera = document.getElementById('btnStartCamera');
    const btnTakePhoto   = document.getElementById('btnTakePhoto');
    const btnDownload    = document.getElementById('btnDownload');
    const videoEl        = document.getElementById('videoElement');
    const placeholder    = document.getElementById('placeholder');
    const countdownEl    = document.getElementById('countdownOverlay');
    const flashEl        = document.getElementById('flashOverlay');
    const gallery        = document.getElementById('gallery');
    const captureCanvas  = document.getElementById('captureCanvas');
    const stripCanvas    = document.getElementById('stripCanvas');

    let stream = null;
    const photos = [];          // stores dataURLs of captured frames
    const SHOTS   = 3;          // number of shots per burst
    const COUNT_N = 3;          // countdown seconds per shot

    // ── Start Camera ─────────────────────────────────
    btnStartCamera.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
            videoEl.srcObject = stream;
            videoEl.style.display = 'block';
            placeholder.style.display = 'none';

            btnStartCamera.disabled = true;
            btnTakePhoto.disabled = false;
        } catch (err) {
            alert('無法開啟鏡頭：' + err.message);
        }
    });

    // ── 3-Shot Burst ──────────────────────────────────
    btnTakePhoto.addEventListener('click', () => {
        btnTakePhoto.disabled = true;
        btnDownload.disabled  = true;
        photos.length = 0;
        gallery.innerHTML = '';

        shootBurst(0);
    });

    function shootBurst(idx) {
        if (idx >= SHOTS) {
            // All shots done → enable download
            btnTakePhoto.disabled = false;
            btnDownload.disabled  = false;
            return;
        }

        startCountdown(COUNT_N, () => {
            captureFrame();
            setTimeout(() => shootBurst(idx + 1), 600);
        });
    }

    function startCountdown(seconds, onDone) {
        countdownEl.textContent = seconds;
        countdownEl.classList.remove('hidden');

        let remaining = seconds;
        const interval = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(interval);
                countdownEl.classList.add('hidden');
                onDone();
            } else {
                countdownEl.textContent = remaining;
            }
        }, 1000);
    }

    function captureFrame() {
        // Flash effect
        flashEl.classList.add('active');
        setTimeout(() => flashEl.classList.remove('active'), 150);

        // Draw current video frame to canvas
        const W = videoEl.videoWidth  || 640;
        const H = videoEl.videoHeight || 480;
        captureCanvas.width  = W;
        captureCanvas.height = H;
        const ctx = captureCanvas.getContext('2d');

        // Mirror horizontally to match what user sees
        ctx.save();
        ctx.translate(W, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoEl, 0, 0, W, H);
        ctx.restore();

        const dataURL = captureCanvas.toDataURL('image/png');
        photos.push(dataURL);

        // Add to gallery
        const item = document.createElement('div');
        item.className = 'gallery-item';
        const img = document.createElement('img');
        img.src = dataURL;
        img.alt = `照片 ${photos.length}`;
        // img already mirrored in canvas, so don't flip again
        img.style.transform = 'none';
        item.appendChild(img);
        gallery.appendChild(item);
    }

    // ── Download Photo Strip ──────────────────────────
    btnDownload.addEventListener('click', () => {
        if (photos.length === 0) return;

        const STRIP_W   = 400;
        const PHOTO_H   = 300;
        const PADDING   = 16;
        const HEADER_H  = 60;
        const FOOTER_H  = 50;
        const TOTAL_H   = HEADER_H + (PHOTO_H + PADDING) * photos.length + FOOTER_H;

        stripCanvas.width  = STRIP_W;
        stripCanvas.height = TOTAL_H;
        const ctx = stripCanvas.getContext('2d');

        // Background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, STRIP_W, TOTAL_H);

        // Gradient border strip (left bar)
        const grd = ctx.createLinearGradient(0, 0, 0, TOTAL_H);
        grd.addColorStop(0, '#60a5fa');
        grd.addColorStop(1, '#c084fc');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 6, TOTAL_H);

        // Header text
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 24px Outfit, Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📸 照相亭', STRIP_W / 2, 40);

        // Draw each photo
        const promises = photos.map((dataURL, i) => {
            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => {
                    const y = HEADER_H + i * (PHOTO_H + PADDING);

                    // Rounded clip
                    const x = PADDING;
                    const w = STRIP_W - PADDING * 2;
                    ctx.save();
                    roundRect(ctx, x, y, w, PHOTO_H, 8);
                    ctx.clip();
                    ctx.drawImage(img, x, y, w, PHOTO_H);
                    ctx.restore();

                    // Photo number
                    ctx.fillStyle = 'rgba(255,255,255,0.7)';
                    ctx.font = '13px Inter, sans-serif';
                    ctx.textAlign = 'left';
                    ctx.fillText(`#${i + 1}`, x + 8, y + PHOTO_H - 8);

                    resolve();
                };
                img.src = dataURL;
            });
        });

        Promise.all(promises).then(() => {
            // Footer
            const now = new Date();
            ctx.fillStyle = 'rgba(148,163,184,0.8)';
            ctx.font = '13px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(now.toLocaleDateString('zh-TW') + ' ' + now.toLocaleTimeString('zh-TW'), STRIP_W / 2, TOTAL_H - 18);

            // Trigger download
            const link = document.createElement('a');
            link.download = `photo-strip-${Date.now()}.png`;
            link.href = stripCanvas.toDataURL('image/png');
            link.click();
        });
    });

    // Helper: rounded rect path (ctx.roundRect not supported on all browsers)
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
});
