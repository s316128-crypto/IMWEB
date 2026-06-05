document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const videoElement = document.getElementById('videoElement');
    const placeholder = document.getElementById('placeholder');
    const countdownOverlay = document.getElementById('countdownOverlay');
    const flashOverlay = document.getElementById('flashOverlay');
    
    const btnStartCamera = document.getElementById('btnStartCamera');
    const btnTakePhoto = document.getElementById('btnTakePhoto');
    const btnDownload = document.getElementById('btnDownload');
    
    const gallery = document.getElementById('gallery');
    const captureCanvas = document.getElementById('captureCanvas');
    const stripCanvas = document.getElementById('stripCanvas');

    // State
    let stream = null;
    let capturedPhotos = []; // Will store data URLs
    const TOTAL_PHOTOS = 3;

    // 1. Detect and Start Camera
    btnStartCamera.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 960 },
                    facingMode: "user" 
                } 
            });
            
            videoElement.srcObject = stream;
            videoElement.style.display = 'block';
            placeholder.style.display = 'none';
            
            // Wait for video to load metadata to get actual dimensions
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                btnTakePhoto.disabled = false;
                btnStartCamera.disabled = true; // Optionally disable start button
                btnStartCamera.textContent = '鏡頭已開啟';
            };
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("無法存取相機，請確認已授權權限。");
        }
    });

    // 2. Start 3 Continuous Photos
    btnTakePhoto.addEventListener('click', async () => {
        // Reset state
        capturedPhotos = [];
        gallery.innerHTML = '';
        btnTakePhoto.disabled = true;
        btnDownload.disabled = true;

        for (let i = 0; i < TOTAL_PHOTOS; i++) {
            await takeSinglePhotoSequence();
            
            // Wait a bit before the next photo starts (if not the last one)
            if (i < TOTAL_PHOTOS - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // All photos taken
        btnTakePhoto.disabled = false;
        btnDownload.disabled = false;
    });

    async function takeSinglePhotoSequence() {
        return new Promise(async (resolve) => {
            // Countdown 3, 2, 1
            countdownOverlay.classList.remove('hidden');
            for (let count = 3; count > 0; count--) {
                countdownOverlay.textContent = count;
                // Add a little pop animation
                countdownOverlay.style.transform = 'scale(1.2)';
                setTimeout(() => countdownOverlay.style.transform = 'scale(1)', 100);
                
                await new Promise(r => setTimeout(r, 1000));
            }
            
            // Take the photo!
            countdownOverlay.classList.add('hidden');
            
            // Flash effect
            flashOverlay.classList.add('active');
            setTimeout(() => {
                flashOverlay.classList.remove('active');
            }, 150);

            // Capture frame to canvas
            const ctx = captureCanvas.getContext('2d');
            captureCanvas.width = videoElement.videoWidth;
            captureCanvas.height = videoElement.videoHeight;
            
            // Mirror the canvas context so the saved image looks like what user sees
            ctx.translate(captureCanvas.width, 0);
            ctx.scale(-1, 1);
            
            ctx.drawImage(videoElement, 0, 0, captureCanvas.width, captureCanvas.height);
            
            const photoDataUrl = captureCanvas.toDataURL('image/jpeg', 0.9);
            capturedPhotos.push(photoDataUrl);
            
            // Add to gallery DOM
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-item';
            
            // We don't mirror the image here because the canvas was already mirrored.
            // But wait, the CSS `.gallery-item img` has `transform: scaleX(-1)`.
            // Let's remove the CSS mirror for the gallery item if we mirrored in canvas, 
            // OR we don't mirror in canvas and mirror in CSS.
            // Actually, people usually want the final photo to NOT be mirrored (read text normally),
            // but while taking a selfie they want a mirror.
            // Let's NOT mirror the canvas context. So the final photo reads correctly.
            // Let's fix that logic:
            
            const finalCtx = captureCanvas.getContext('2d');
            // reset transform just in case
            finalCtx.setTransform(1, 0, 0, 1, 0, 0);
            // We want the saved photo to be exactly what the camera sees (non-mirrored text),
            // but the video preview IS mirrored.
            finalCtx.drawImage(videoElement, 0, 0, captureCanvas.width, captureCanvas.height);
            const actualPhotoDataUrl = captureCanvas.toDataURL('image/jpeg', 0.9);
            
            // Update the array with actual data
            capturedPhotos[capturedPhotos.length - 1] = actualPhotoDataUrl;

            const img = document.createElement('img');
            img.src = actualPhotoDataUrl;
            imgContainer.appendChild(img);
            gallery.appendChild(imgContainer);

            resolve();
        });
    }

    // 3. Download the 3 photos combined into one strip
    btnDownload.addEventListener('click', () => {
        if (capturedPhotos.length === 0) return;

        const ctx = stripCanvas.getContext('2d');
        
        // Settings for the photo strip
        const photoWidth = 600;
        const aspectRatio = videoElement.videoHeight / videoElement.videoWidth;
        const photoHeight = photoWidth * aspectRatio;
        const padding = 30;
        const footerHeight = 120;
        
        // Total height = padding + (3 * photoHeight) + (2 * padding between photos) + footerHeight
        stripCanvas.width = photoWidth + (padding * 2);
        stripCanvas.height = padding + (TOTAL_PHOTOS * photoHeight) + ((TOTAL_PHOTOS - 1) * padding) + footerHeight;

        // Draw background
        ctx.fillStyle = '#ffffff'; // White paper background
        ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

        // Load images and draw them
        let loadedCount = 0;
        const images = [];

        capturedPhotos.forEach((dataUrl, index) => {
            const img = new Image();
            img.onload = () => {
                images[index] = img;
                loadedCount++;
                
                if (loadedCount === TOTAL_PHOTOS) {
                    drawStripAndDownload(images, ctx, photoWidth, photoHeight, padding, footerHeight);
                }
            };
            img.src = dataUrl;
        });
    });

    function drawStripAndDownload(images, ctx, photoWidth, photoHeight, padding, footerHeight) {
        // Draw each photo
        images.forEach((img, index) => {
            const x = padding;
            const y = padding + index * (photoHeight + padding);
            
            // Mirror the image horizontally BEFORE drawing it to the strip
            // Because our captured photo is non-mirrored, but users usually prefer their selfies mirrored in the final strip as they saw it.
            // Actually, let's keep it mirrored in the final strip so it matches their preview.
            ctx.save();
            ctx.translate(x + photoWidth, y);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, photoWidth, photoHeight);
            ctx.restore();
            
            // Add a subtle inner border/shadow effect to each photo
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, photoWidth, photoHeight);
        });

        // Draw Text/Footer
        const textY = stripCanvas.height - (footerHeight / 2);
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        
        // Main Title
        ctx.font = 'bold 36px "Inter", sans-serif';
        ctx.fillText('Photo Booth ✨', stripCanvas.width / 2, textY - 10);
        
        // Date
        ctx.font = '20px "Inter", sans-serif';
        ctx.fillStyle = '#64748b';
        const dateStr = new Date().toLocaleString('zh-TW', { 
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
        ctx.fillText(dateStr, stripCanvas.width / 2, textY + 30);

        // Trigger Download
        const link = document.createElement('a');
        link.download = `PhotoBooth_${new Date().getTime()}.png`;
        link.href = stripCanvas.toDataURL('image/png');
        link.click();
    }
});
