/**
 * YA - 场景控制器 - System B 粒子系统
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { Yr } from "./utils.js";
import { qA } from "./qA.js";

export class YA {
    constructor(options) {
        this.loaded = false;
        this.texture = null;

        this.options = options;
        this.theme = options.theme || "dark";
        this.interactive = options.interactive || false;

        this.options.background =
            this.theme === "dark" ? new THREE.Color(0x000000) : new THREE.Color(0xffffff);

        this.pixelRatio = options.pixelRatio || window.devicePixelRatio;
        this.particlesScale = options.particlesScale || 1;
        this.density = options.density || 200;
        this.verbose = options.verbose || false;

        this.scene = new THREE.Scene();
        this.scene.background = null;

        this.canvas = document.createElement("canvas");
        this.options.container.appendChild(this.canvas);
        this.canvas.width = this.options.container.offsetWidth;
        this.canvas.height = this.options.container.offsetHeight;

        THREE.ColorManagement.enabled = false;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
            stencil: false,
            precision: "highp",
        });

        this.gl = this.renderer.getContext();
        this.renderer.extensions.get("EXT_color_buffer_float");
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.renderer.setPixelRatio(this.pixelRatio);

        this.onWindowResize = this.onWindowResize.bind(this);

        this.clock = new THREE.Clock();
        this.time = 0;
        this.lastTime = 0;
        this.dt = 0;
        this.skipFrame = false;
        this.isPaused = false;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.intersectionPoint = new THREE.Vector3();
        this.isIntersecting = false;
        this.mouseIsOver = false;

        this.colorControls = null;
        this.ringWidth = 0;
        this.ringWidth2 = 0;
        this.ringDisplacement = 0;

        this.particles = null;
        this.camera = null;
        this.raycastPlane = null;

        this.initCamera();
        this.initScene();
        this.initEvents();

        this.raycastPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(12.5, 12.5),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                visible: false,
                side: THREE.DoubleSide,
            })
        );
        this.scene.add(this.raycastPlane);
    }

    initEvents() {
        window.addEventListener("resize", (_e) => {
            this.onWindowResize();
        });
    }

    onWindowResize() {
        this.canvas.width = this.options.container.offsetWidth;
        this.canvas.height = this.options.container.offsetHeight;
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.camera.aspect = this.canvas.width / this.canvas.height;
        this.camera.updateProjectionMatrix();
        if (this.particles) this.particles.resize();
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            40,
            this.gl.drawingBufferWidth / this.gl.drawingBufferHeight,
            0.1,
            1000
        );
        this.camera.position.z = 3.1;
    }

    initScene() {
        this.colorControls = {
            color1: this.theme === "dark" ? "#7189ff" : "#2c64ed",
            color2: this.theme === "dark" ? "#3074f9" : "#f84242",
            color3: this.theme === "dark" ? "#000000" : "#ffcf03",
        };

        this.ringWidth = this.options.ringWidth || 0.107;
        this.ringWidth2 = this.options.ringWidth2 || 0.05;
        this.ringDisplacement = this.options.ringDisplacement || 0.15;

        this.initParticles();
        this.onLoaded();
    }

    initParticles() {
        this.particles = new qA(this);
    }

    stop() {
        this.isPaused = true;
        this.clock.stop();
    }

    resume() {
        this.isPaused = false;
        this.clock.start();
    }

    killParticles() {
        this.scene.remove(this.particles.mesh);
        this.particles.kill();
    }

    kill() {
        this.stop();
        window.removeEventListener("resize", this.onWindowResize);

        if (this.raycastPlane) {
            this.scene.remove(this.raycastPlane);
            this.raycastPlane.geometry.dispose();
            this.raycastPlane.material.dispose();
        }

        this.renderer.dispose();
        if (this.canvas.parentElement) this.canvas.parentElement.removeChild(this.canvas);
    }

    onLoaded() {
        this.loaded = true;
    }

    preRender() {
        this.dt = this.clock.getElapsedTime() - this.lastTime;
        this.lastTime = this.clock.getElapsedTime();
        this.time += this.dt;

        this.particles.update();

        if (this.interactive && !this.skipFrame) {
            const rect = this.canvas.getBoundingClientRect();

            this.mouse.x = (Yr.cursor.x - rect.left) * (Yr.screenWidth / rect.width);
            this.mouse.y = (Yr.cursor.y - rect.top) * (Yr.screenHeight / rect.height);

            this.mouse.x = (this.mouse.x / Yr.screenWidth) * 2 - 1;
            this.mouse.y = -(this.mouse.y / Yr.screenHeight) * 2 + 1;

            this.mouseIsOver = !(
                this.mouse.x < -1 ||
                this.mouse.x > 1 ||
                this.mouse.y < -1 ||
                this.mouse.y > 1
            );
        }

        this.skipFrame = !this.skipFrame;
        if (this.skipFrame) return;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const hits = this.raycaster.intersectObject(this.raycastPlane);

        if (hits.length > 0 && this.mouseIsOver) {
            this.intersectionPoint.copy(hits[0].point);
            this.isIntersecting = true;
        } else {
            this.isIntersecting = false;
        }
    }

    render() {
        if (!this.loaded || this.isPaused) return;

        this.preRender();

        this.renderer.setRenderTarget(null);
        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);

        this.postRender();
    }

    postRender() {
        this.particles.postRender();
    }

    setTheme(theme) {
        if (theme !== "light" && theme !== "dark") return;
        if (this.theme === theme) return;

        this.theme = theme;
        this.options.theme = theme;
        this.options.background =
            theme === "dark" ? new THREE.Color(0x000000) : new THREE.Color(0xffffff);

        this.colorControls = {
            color1: theme === "dark" ? "#7189ff" : "#2c64ed",
            color2: theme === "dark" ? "#3074f9" : "#f84242",
            color3: theme === "dark" ? "#000000" : "#ffcf03",
        };

        if (this.particles && this.particles.applyTheme) {
            this.particles.applyTheme(theme, this.colorControls);
        }
    }
}
