(function () {
    'use strict';

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('Antigravity Effect: Initializing...');

        // Create Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '999999'; // Force to very top
        canvas.style.pointerEvents = 'none'; // Allow clicks to pass through to links
        document.body.appendChild(canvas);

        let width, height;
        let particles = [];

        // Configuration
        const PARTICLE_COUNT = 150;
        const GRAVITY = 0.5;
        const BOUNCE = -0.5;
        // Google Brand Colors: Blue, Red, Yellow, Green
        const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

        // State
        let gravityEnabled = false;
        let mouseX = 0;
        let mouseY = 0;

        // Particle Class
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;

                // Floating velocity (Status 1)
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;

                // Visuals: Line
                this.length = Math.random() * 15 + 10;
                this.width = Math.random() * 2 + 1;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];

                // Rotation
                this.angle = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;

                // Collision radius (simplified)
                this.radius = this.length / 2;
            }

            update() {
                if (gravityEnabled) {
                    // === Status 2: Falling ===
                    this.vy += GRAVITY;
                    this.vx *= 0.99; // Air resistance
                } else {
                    // === Status 1: Floating ===

                    // Mouse repulsion (Fluid feel)
                    if (mouseX !== 0 && mouseY !== 0) {
                        const dx = mouseX - this.x;
                        const dy = mouseY - this.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 100) {
                            const pushForce = (100 - dist) * 0.001;
                            const angle = Math.atan2(dy, dx);
                            this.vx -= Math.cos(angle) * pushForce;
                            this.vy -= Math.sin(angle) * pushForce;
                        }
                    }

                    this.vx *= 0.95;
                    this.vy *= 0.95;

                    // Maintain minimum idle movement
                    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                    if (speed < 0.5) {
                        this.vx += (Math.random() - 0.5) * 0.05;
                        this.vy += (Math.random() - 0.5) * 0.05;
                    }
                }

                this.angle += this.rotationSpeed;
                this.x += this.vx;
                this.y += this.vy;

                // Boundary & Collision
                if (gravityEnabled) {
                    // Floor Bounce
                    if (this.y + this.radius > height) {
                        this.y = height - this.radius;
                        this.vy *= BOUNCE;
                        this.vx *= 0.8; // Friction

                        // Stop rotation if settled
                        if (Math.abs(this.vy) < 1) {
                            this.rotationSpeed *= 0.9;
                        }
                    }

                    // Walls
                    if (this.x - this.radius < 0) {
                        this.x = this.radius;
                        this.vx *= -0.5;
                    }
                    if (this.x + this.radius > width) {
                        this.x = width - this.radius;
                        this.vx *= -0.5;
                    }
                } else {
                    // Wrap around in floating mode
                    if (this.x < -20) this.x = width + 20;
                    if (this.x > width + 20) this.x = -20;
                    if (this.y < -20) this.y = height + 20;
                    if (this.y > height + 20) this.y = -20;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                ctx.beginPath();
                ctx.moveTo(-this.length / 2, 0);
                ctx.lineTo(this.length / 2, 0);

                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.width;
                ctx.lineCap = 'round';
                ctx.stroke();

                ctx.restore();
            }
        }

        // Simple collision resolution for stacking
        function resolveCollisions() {
            if (!gravityEnabled) return;

            // Optimization: Only check a subset or grid if we had time, 
            // but O(N^2) for 150 particles is fine for modern JS.
            for (let i = 0; i < particles.length; i++) {
                // Optimization: Skip particles that are high up to save cycles, only check bottom pile
                /* if (particles[i].y < height - 200) continue; */ // (Optional)

                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];

                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const distSq = dx * dx + dy * dy;

                    const minD = (p1.length + p2.length) * 0.3; // Visual stacking radius
                    const minDSq = minD * minD;

                    if (distSq < minDSq && distSq > 0) {
                        const dist = Math.sqrt(distSq);
                        const angle = Math.atan2(dy, dx);
                        const overlap = minD - dist;

                        const moveX = Math.cos(angle) * overlap * 0.5;
                        const moveY = Math.sin(angle) * overlap * 0.5;

                        p1.x -= moveX;
                        p1.y -= moveY;
                        p2.x += moveX;
                        p2.y += moveY;

                        const avgVx = (p1.vx + p2.vx) * 0.5;
                        const avgVy = (p1.vy + p2.vy) * 0.5;
                        p1.vx = avgVx;
                        p1.vy = avgVy;
                        p2.vx = avgVx;
                        p2.vy = avgVy;
                    }
                }
            }
        }

        function initParticles() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        }

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => p.update());
            resolveCollisions();
            particles.forEach(p => p.draw());

            requestAnimationFrame(animate);
        }

        // --- Interaction Logic ---

        window.addEventListener('resize', resize);

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Link Interceptor
        document.addEventListener('click', (e) => {
            // Find closest anchor tag
            const link = e.target.closest('a');

            if (link && link.href) {
                // Check if internal and not new tab
                const isInternal = link.host === window.location.host;
                const targetWait = link.target === '_blank';
                const isAnchor = link.getAttribute('href').startsWith('#');

                if (isInternal && !targetWait && !isAnchor) {
                    e.preventDefault(); // Stop navigation

                    // Trigger Gravity
                    gravityEnabled = true;

                    // Give slight random impulse to wake them up
                    particles.forEach(p => {
                        p.vx += (Math.random() - 0.5) * 2;
                        p.vy += Math.random() * 2;
                    });

                    // Wait for fall animation then navigate
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 800); // 800ms is enough for a satisfying drop
                }
            }
        });

        // Start
        initParticles();
        animate();
    }
})();
