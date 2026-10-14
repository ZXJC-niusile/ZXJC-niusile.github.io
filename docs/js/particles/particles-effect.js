import { YA } from './YA.js';

// Global configuration
const CONFIG = {
    theme: 'light',
    density: 230,
    particlesScale: 0.6,
    ringWidth: 0.15,
    ringWidth2: 0.05,
    ringDisplacement: 0.15,
};

class ParticleSystem {
    constructor() {
        this.wrapper = null;
        this.init();
    }

    getCurrentTheme() {
        if (document.documentElement.classList.contains('dark')) return 'dark';
        try {
            const savedTheme = localStorage.getItem('theme-mode');
            if (savedTheme === 'style-dark') return 'dark';
        } catch (_) {}
        return 'light';
    }

    syncTheme() {
        if (!this.wrapper) return;
        const newTheme = this.getCurrentTheme();
        if (this.wrapper.theme === newTheme) return;

        console.log('[Particles] Theme synced:', newTheme);
        if (typeof this.wrapper.setTheme === 'function') {
            this.wrapper.setTheme(newTheme);
        } else {
            this.wrapper.theme = newTheme;
            this.wrapper.options.theme = newTheme;
        }
    }

    init() {
        CONFIG.theme = this.getCurrentTheme();

        // Create container
        const container = document.getElementById('particles-container');
        if (!container) {
            console.error('[Particles] Container not found');
            return;
        }

        // Initialize system
        this.wrapper = new YA({
            container: container,
            theme: CONFIG.theme,
            particlesScale: CONFIG.particlesScale,
            density: CONFIG.density,
            interactive: true,
            gui: false,
            verbose: false,
            ringWidth: CONFIG.ringWidth,
            ringWidth2: CONFIG.ringWidth2,
            ringDisplacement: CONFIG.ringDisplacement,
        });

        console.log('[Particles] System initialized');
        this.animate();

        // Expose globally
        window.particlesWrapper = this;

        // Watch theme changes
        this.watchTheme();
    }

    animate = () => {
        this.syncTheme();
        if (this.wrapper && this.wrapper.render) {
            this.wrapper.render();
        }
        requestAnimationFrame(this.animate);
    }

    watchTheme() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark');
                    const newTheme = isDark ? 'dark' : 'light';
                    if (this.wrapper && this.wrapper.theme !== newTheme) {
                        this.syncTheme();
                    }
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        window.addEventListener('storage', (event) => {
            if (event.key === 'theme-mode') this.syncTheme();
        });

        const switcher = document.getElementById('trm-swich');
        if (switcher) {
            switcher.addEventListener('change', () => {
                requestAnimationFrame(() => this.syncTheme());
            });
        }
    }
}

// Auto-initialize on load
let particleSystem = null;

function initParticleEffect() {
    // Skip on homepage
    const pathname = window.location.pathname;
    const normalizedPath = pathname.replace(/\/+$/, '') || '/';
    const isHome = normalizedPath === '/' || normalizedPath === '/index.html' || normalizedPath === '/index';

    if (isHome) {
        console.log('[Particles] Homepage detected, skipping');
        return;
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createParticleSystem();
        });
    } else {
        createParticleSystem();
    }
}

function createParticleSystem() {
    if (particleSystem) {
        console.log('[Particles] System already exists, skipping');
        return;
    }
    particleSystem = new ParticleSystem();
}

// Initialize
initParticleEffect();

// Export for debugging
window.ParticleDebug = {
    system: particleSystem,
    init: initParticleEffect,
    CONFIG: CONFIG,
};
console.log('[Particles] Script loaded');
