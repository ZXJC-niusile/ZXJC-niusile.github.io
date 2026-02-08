/**
 * Matrix Digital Rain Effect
 * Custom implementation for blog intro page
 */
(function () {
    'use strict';

    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Matrix characters (katakana + numbers + symbols)
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*';
    const charArray = chars.split('');

    let fontSize = 16;
    let columns;
    let drops = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);

        // Initialize drops
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
    }

    function draw() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Green text
        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            // Random character
            const char = charArray[Math.floor(Math.random() * charArray.length)];

            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Head of the drop (brighter)
            ctx.fillStyle = '#fff';
            ctx.fillText(char, x, y);

            // Trail
            for (let j = 1; j < 25; j++) {
                const trailY = y - j * fontSize;
                if (trailY > 0) {
                    const alpha = 1 - (j / 25);
                    const green = Math.floor(255 * alpha);
                    ctx.fillStyle = `rgb(0, ${green}, 0)`;
                    const trailChar = charArray[Math.floor(Math.random() * charArray.length)];
                    ctx.fillText(trailChar, x, trailY);
                }
            }

            // Reset drop when it reaches bottom
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i] += 0.5 + Math.random() * 0.5;
        }
    }

    // Initialize
    resize();
    window.addEventListener('resize', resize);

    // Fill initial black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animation loop
    function animate() {
        draw();
        requestAnimationFrame(animate);
    }
    animate();
})();
