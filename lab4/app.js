/**
 * Welcome Cover Board - Simplified Interactive Logic
 * Implements: Clock, Click-Triggered Audio Chime, Canvas Background with Particle Physics,
 * and Dynamic Gold Sparkle Ripple Effects on Click.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const bgCanvas = document.getElementById('bgCanvas');
    const effectCanvas = document.getElementById('effectCanvas');
    
    const widgetTime = document.getElementById('widgetTime');
    const widgetPeriod = document.getElementById('widgetPeriod');
    const widgetDate = document.getElementById('widgetDate');
    
    const welcomeCard = document.getElementById('welcomeCard');

    // App State
    const state = {
        audioCtx: null,
        mouse: { x: null, y: null, active: false }
    };

    // Initialize Canvas Contexts
    let bgCtx = bgCanvas.getContext('2d');
    let effectCtx = effectCanvas.getContext('2d');
    
    function resizeCanvases() {
        const dpr = window.devicePixelRatio || 1;
        
        bgCanvas.width = window.innerWidth * dpr;
        bgCanvas.height = window.innerHeight * dpr;
        bgCanvas.style.width = `${window.innerWidth}px`;
        bgCanvas.style.height = `${window.innerHeight}px`;
        bgCtx.scale(dpr, dpr);

        effectCanvas.width = window.innerWidth * dpr;
        effectCanvas.height = window.innerHeight * dpr;
        effectCanvas.style.width = `${window.innerWidth}px`;
        effectCanvas.style.height = `${window.innerHeight}px`;
        effectCtx.scale(dpr, dpr);
    }
    
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    // Track Mouse Coordinates
    window.addEventListener('mousemove', (e) => {
        state.mouse.x = e.clientX;
        state.mouse.y = e.clientY;
        state.mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        state.mouse.x = null;
        state.mouse.y = null;
        state.mouse.active = false;
    });

    // Handle touch inputs for mobile/tablets
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            state.mouse.x = e.touches[0].clientX;
            state.mouse.y = e.touches[0].clientY;
            state.mouse.active = true;
        }
    });

    window.addEventListener('touchend', () => {
        state.mouse.x = null;
        state.mouse.y = null;
        state.mouse.active = false;
    });

    /* ==========================================================================
       Clock Widget Logic
       ========================================================================== */
    function updateClock() {
        const now = new Date();
        
        // Time format
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const hourStr = String(hours).padStart(2, '0');

        widgetTime.textContent = `${hourStr}:${minutes}:${seconds}`;
        widgetPeriod.textContent = ampm;

        // Date format (Traditional Chinese)
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const dayOfWeek = days[now.getDay()];

        widgetDate.textContent = `${year}年${month}月${date}日 ${dayOfWeek}`;
    }

    setInterval(updateClock, 1000);
    updateClock(); // Run immediately

    /* ==========================================================================
       Web Audio API - Elegant Chime Synthesizer
       ========================================================================== */
    function initAudio() {
        if (!state.audioCtx) {
            state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (state.audioCtx.state === 'suspended') {
            state.audioCtx.resume();
        }
    }

    function playWelcomeChime() {
        initAudio();
        if (!state.audioCtx) return;

        const now = state.audioCtx.currentTime;
        
        // Dynamic harmonic chord: E5 (659.25), G#5 (830.61), B5 (987.77), E6 (1318.51)
        const chord = [659.25, 830.61, 987.77, 1318.51];
        
        chord.forEach((freq, idx) => {
            const timeDelay = idx * 0.08; // Arpeggio spacing
            const osc = state.audioCtx.createOscillator();
            const gainNode = state.audioCtx.createGain();
            
            // Soft sine waves for an ambient bell vibe
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + timeDelay);
            
            gainNode.gain.setValueAtTime(0, now + timeDelay);
            gainNode.gain.linearRampToValueAtTime(0.08, now + timeDelay + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + timeDelay + 2.0); // natural decay ring
            
            osc.connect(gainNode);
            gainNode.connect(state.audioCtx.destination);
            
            osc.start(now + timeDelay);
            osc.stop(now + timeDelay + 2.2);
        });
    }

    /* ==========================================================================
       Canvas Interactive Background (Particles & Connections)
       ========================================================================== */
    const particles = [];
    const particleCount = 70;
    const connectionDistance = 120;
    const mouseAttractRadius = 180;
    
    class Particle {
        constructor() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 2 + 1;
            
            // Palette of subtle cyan, violet, and soft white/blue
            const colors = [
                'rgba(0, 242, 254, ', 
                'rgba(79, 172, 254, ', 
                'rgba(138, 43, 226, ', 
                'rgba(255, 255, 255, '
            ];
            this.baseColor = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.4 + 0.15;
        }

        update() {
            // Mouse attraction physics
            if (state.mouse.active && state.mouse.x !== null) {
                const dx = state.mouse.x - this.x;
                const dy = state.mouse.y - this.y;
                const dist = Math.hypot(dx, dy);
                
                if (dist < mouseAttractRadius) {
                    const force = (mouseAttractRadius - dist) / mouseAttractRadius;
                    // Gently pull towards mouse
                    this.vx += (dx / dist) * force * 0.008;
                    this.vy += (dy / dist) * force * 0.008;
                }
            }

            // Move particle
            this.x += this.vx;
            this.y += this.vy;

            // Apply friction/drag so they don't accelerate to infinity
            this.vx *= 0.97;
            this.vy *= 0.97;

            // Cap velocity
            const speed = Math.hypot(this.vx, this.vy);
            if (speed > 1.5) {
                this.vx = (this.vx / speed) * 1.5;
                this.vy = (this.vy / speed) * 1.5;
            }

            // Edge bounce / wrap
            if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
            if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
            
            // Keep inside screen
            if (this.x < -10) this.x = window.innerWidth + 10;
            if (this.x > window.innerWidth + 10) this.x = -10;
            if (this.y < -10) this.y = window.innerHeight + 10;
            if (this.y > window.innerHeight + 10) this.y = -10;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor + this.alpha + ')';
            ctx.fill();
        }
    }

    // Spawn Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawBackground() {
        bgCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Draw deep gradient background
        const grad = bgCtx.createRadialGradient(
            window.innerWidth / 2, window.innerHeight / 2, 0,
            window.innerWidth / 2, window.innerHeight / 2, Math.max(window.innerWidth, window.innerHeight)
        );
        grad.addColorStop(0, '#0c0b24');
        grad.addColorStop(0.5, '#05040f');
        grad.addColorStop(1, '#020105');
        
        bgCtx.fillStyle = grad;
        bgCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Update and draw particles
        particles.forEach(p => {
            p.update();
            p.draw(bgCtx);
        });

        // Draw connection lines
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.hypot(dx, dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - (dist / connectionDistance)) * 0.12;
                    bgCtx.beginPath();
                    bgCtx.moveTo(p1.x, p1.y);
                    bgCtx.lineTo(p2.x, p2.y);
                    bgCtx.strokeStyle = `rgba(141, 169, 236, ${alpha})`;
                    bgCtx.lineWidth = 0.7;
                    bgCtx.stroke();
                }
            }

            // Connect to mouse cursor
            if (state.mouse.active && state.mouse.x !== null) {
                const dx = p1.x - state.mouse.x;
                const dy = p1.y - state.mouse.y;
                const dist = Math.hypot(dx, dy);

                if (dist < mouseAttractRadius - 20) {
                    const alpha = (1 - (dist / (mouseAttractRadius - 20))) * 0.2;
                    bgCtx.beginPath();
                    bgCtx.moveTo(p1.x, p1.y);
                    bgCtx.lineTo(state.mouse.x, state.mouse.y);
                    bgCtx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                    bgCtx.lineWidth = 0.8;
                    bgCtx.stroke();
                }
            }
        }
    }

    /* ==========================================================================
       Canvas Star Burst / Sparkles Overlay Effect
       ========================================================================== */
    const sparkles = [];
    
    class Sparkle {
        constructor(x, y, isBurst = false) {
            this.x = x;
            this.y = y;
            
            if (isBurst) {
                // Burst goes in random directions with higher velocity
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4.0 + 1.2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.radius = Math.random() * 3.5 + 1.5;
                this.decay = Math.random() * 0.012 + 0.006;
            } else {
                // Slow drift trail
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.2) * 0.3;
                this.radius = Math.random() * 2 + 1;
                this.decay = Math.random() * 0.02 + 0.015;
            }
            
            this.life = 1;
            this.gravity = 0.025; // light gravity
            
            // Golden and amber colors
            const goldColors = ['#ffd700', '#ffb020', '#fff4c2', '#ffffff'];
            this.color = goldColors[Math.floor(Math.random() * goldColors.length)];
            
            this.rotation = Math.random() * Math.PI;
            this.rotationSpeed = (Math.random() - 0.5) * 0.12;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.rotation += this.rotationSpeed;
            this.life -= this.decay;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            
            // Diamond star shape
            ctx.beginPath();
            const r = this.radius;
            ctx.moveTo(0, -r * 1.8);
            ctx.lineTo(r * 0.4, -r * 0.4);
            ctx.lineTo(r * 1.8, 0);
            ctx.lineTo(r * 0.4, r * 0.4);
            ctx.lineTo(0, r * 1.8);
            ctx.lineTo(-r * 0.4, r * 0.4);
            ctx.lineTo(-r * 1.8, 0);
            ctx.lineTo(-r * 0.4, -r * 0.4);
            ctx.closePath();
            ctx.fill();
            
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            ctx.restore();
        }
    }

    function spawnBurst(x, y, count) {
        for (let i = 0; i < count; i++) {
            sparkles.push(new Sparkle(x, y, true));
        }
    }

    // Force feedback push on particles when clicking
    function pushParticlesAway(clickX, clickY) {
        const pushRadius = 250;
        const pushForce = 4.5;
        
        particles.forEach(p => {
            const dx = p.x - clickX;
            const dy = p.y - clickY;
            const dist = Math.hypot(dx, dy);
            
            if (dist < pushRadius) {
                const force = (pushRadius - dist) / pushRadius;
                // Add outwards velocity impulse
                p.vx += (dx / dist) * force * pushForce;
                p.vy += (dy / dist) * force * pushForce;
            }
        });
    }

    function drawSparkles() {
        effectCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Subtle sparkle trail following mouse movements
        if (state.mouse.active && state.mouse.x !== null) {
            if (Math.random() < 0.25) {
                sparkles.push(new Sparkle(state.mouse.x, state.mouse.y, false));
            }
        }

        // Update and filter sparkles
        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];
            s.update();
            if (s.life <= 0) {
                sparkles.splice(i, 1);
            } else {
                s.draw(effectCtx);
            }
        }
    }

    /* ==========================================================================
       Combined Animation Loop
       ========================================================================== */
    function animate() {
        drawBackground();
        drawSparkles();
        requestAnimationFrame(animate);
    }
    animate();

    /* ==========================================================================
       Global Click/Tap Interactive Trigger
       ========================================================================== */
    function triggerInteraction(clientX, clientY) {
        // 1. Play chime audio chord
        playWelcomeChime();

        // 2. Spawn golden starburst at coordinates
        spawnBurst(clientX, clientY, 65);

        // 3. Physically push canvas particles away from clicked location
        pushParticlesAway(clientX, clientY);

        // 4. Subtle scale pop on welcome card
        welcomeCard.style.transform = 'scale(0.97)';
        setTimeout(() => {
            welcomeCard.style.transform = 'scale(1)';
        }, 150);
    }

    // Bind Click and Tap events anywhere on window
    window.addEventListener('click', (e) => {
        // Prevent click trigger when adjusting something else (if we ever add interactive buttons)
        triggerInteraction(e.clientX, e.clientY);
    });

    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            // Trigger on the first touch point
            triggerInteraction(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    // Trigger an initial visual-only star burst on load at the center
    setTimeout(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        spawnBurst(centerX, centerY, 50);
    }, 800);
});
