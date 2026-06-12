/**
 * IMWEB Homepage - Ambient Particle Background
 */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    const mouse = { x: null, y: null };
    const particles = [];
    const PARTICLE_COUNT = 60;
    const CONNECT_DIST = 100;
    const MOUSE_RADIUS = 150;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.r = Math.random() * 1.8 + 0.8;
            this.alpha = Math.random() * 0.4 + 0.1;
            const palette = ['rgba(0,242,254,', 'rgba(79,172,254,', 'rgba(161,140,209,', 'rgba(255,255,255,'];
            this.color = palette[Math.floor(Math.random() * palette.length)];
        }
        update() {
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const d = Math.hypot(dx, dy);
                if (d < MOUSE_RADIUS) {
                    const f = (MOUSE_RADIUS - d) / MOUSE_RADIUS;
                    this.vx += (dx / d) * f * 0.007;
                    this.vy += (dy / d) * f * 0.007;
                }
            }
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.98;
            this.vy *= 0.98;
            const sp = Math.hypot(this.vx, this.vy);
            if (sp > 1.2) { this.vx = this.vx/sp*1.2; this.vy = this.vy/sp*1.2; }
            if (this.x < 0) this.x = window.innerWidth;
            if (this.x > window.innerWidth) this.x = 0;
            if (this.y < 0) this.y = window.innerHeight;
            if (this.y > window.innerHeight) this.y = 0;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function loop() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Background
        const grad = ctx.createRadialGradient(
            window.innerWidth/2, window.innerHeight/2, 0,
            window.innerWidth/2, window.innerHeight/2, Math.max(window.innerWidth, window.innerHeight)
        );
        grad.addColorStop(0, '#0c0b24');
        grad.addColorStop(0.5, '#05040f');
        grad.addColorStop(1, '#020105');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Update & draw particles
        particles.forEach(p => { p.update(); p.draw(); });

        // Connect lines between particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i+1; j < particles.length; j++) {
                const p1 = particles[i], p2 = particles[j];
                const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if (d < CONNECT_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(141,169,236,${(1 - d/CONNECT_DIST) * 0.1})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
            // Connect to mouse
            if (mouse.x !== null) {
                const p = particles[i];
                const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (d < MOUSE_RADIUS) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0,242,254,${(1 - d/MOUSE_RADIUS) * 0.18})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(loop);
    }

    loop();
});
