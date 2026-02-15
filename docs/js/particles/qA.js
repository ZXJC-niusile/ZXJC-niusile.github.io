/**
 * qA - 粒子引擎 - System B 粒子系统
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import PoissonDiskSampling from "https://cdn.jsdelivr.net/npm/poisson-disk-sampling@2.3.1/+esm";
import { mapLinear, ValueNoise1D } from "./utils.js";
import {
    SIM_VERTEX_SHADER,
    SIM_FRAGMENT_SHADER,
    RENDER_VERTEX_SHADER,
    RENDER_FRAGMENT_SHADER
} from "./shaders.js";

export class qA {
    constructor(scene) {
        this.scene = scene;
        this.renderer = scene.renderer;
        this.camera = scene.camera;

        this.size = 256;
        this.length = this.size * this.size;
        this.lastTime = 0;
        this.everRendered = false;

        this.ringPos = new THREE.Vector2(0, 0);
        this.cursorPos = new THREE.Vector2(0, 0);
        this.colorScheme = scene.theme === "dark" ? 0 : 1;
        this.particleScale =
            this.scene.renderer.domElement.width /
            this.scene.pixelRatio /
            2000 *
            this.scene.particlesScale;

        this.pointsData = [];
        this.count = 0;

        this.posTex = null;
        this.rt1 = null;
        this.rt2 = null;

        this.noise = null;
        this.simScene = null;
        this.simCamera = null;
        this.simMaterial = null;
        this.renderMaterial = null;
        this.mesh = null;

        this.createPoints();
        this.init();
    }

    createPoints() {
        const points = new PoissonDiskSampling({
            shape: [500, 500],
            minDistance: mapLinear(this.scene.density, 0, 300, 10, 2),
            maxDistance: mapLinear(this.scene.density, 0, 300, 11, 3),
            tries: 20,
        }).fill();

        this.pointsData = [];
        for (let i = 0; i < points.length; i++) {
            this.pointsData.push(points[i][0] - 250, points[i][1] - 250);
        }
        this.count = this.pointsData.length / 2;
    }

    createDataTexturePosition() {
        const arr = new Float32Array(this.length * 4);
        for (let i = 0; i < this.count; i++) {
            const r = i * 4;
            arr[r + 0] = this.pointsData[i * 2 + 0] * (1 / 250);
            arr[r + 1] = this.pointsData[i * 2 + 1] * (1 / 250);
            arr[r + 2] = 0;
            arr[r + 3] = 0;
        }

        const tex = new THREE.DataTexture(
            arr,
            this.size,
            this.size,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        tex.needsUpdate = true;
        return tex;
    }

    createRenderTarget() {
        return new THREE.WebGLRenderTarget(this.size, this.size, {
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.HalfFloatType,
            depthBuffer: false,
            stencilBuffer: false,
        });
    }

    init() {
        this.posTex = this.createDataTexturePosition();
        this.rt1 = this.createRenderTarget();
        this.rt2 = this.createRenderTarget();

        this.renderer.setRenderTarget(this.rt1);
        this.renderer.setClearColor(0, 0);
        this.renderer.clear();

        this.renderer.setRenderTarget(this.rt2);
        this.renderer.setClearColor(0, 0);
        this.renderer.clear();

        this.renderer.setRenderTarget(null);

        this.noise = new ValueNoise1D();

        this.simScene = new THREE.Scene();
        this.simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.simMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uPosition: { value: this.posTex },
                uPosRefs: { value: this.posTex },
                uRingPos: { value: new THREE.Vector2(0, 0) },
                uRingRadius: { value: 0.2 },
                uDeltaTime: { value: 0 },
                uRingWidth: { value: 0.05 },
                uRingWidth2: { value: 0.015 },
                uRingDisplacement: { value: this.scene.ringDisplacement },
                uTime: { value: 0 },
            },
            vertexShader: SIM_VERTEX_SHADER,
            fragmentShader: SIM_FRAGMENT_SHADER,
        });

        this.simScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.simMaterial));

        const geometry = new THREE.BufferGeometry();
        const uv = new Float32Array(this.count * 2);
        const position = new Float32Array(this.count * 3);
        const seeds = new Float32Array(this.count * 4);

        for (let i = 0; i < this.count; i++) {
            const x = i % this.size;
            const y = Math.floor(i / this.size);
            uv[i * 2 + 0] = x / this.size;
            uv[i * 2 + 1] = y / this.size;
        }

        for (let i = 0; i < this.count; i++) {
            seeds[i * 4 + 0] = Math.random();
            seeds[i * 4 + 1] = Math.random();
            seeds[i * 4 + 2] = Math.random();
            seeds[i * 4 + 3] = Math.random();
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
        geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
        geometry.setAttribute("seeds", new THREE.BufferAttribute(seeds, 4));

        this.renderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uPosition: { value: this.posTex },
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color(this.scene.colorControls.color1) },
                uColor2: { value: new THREE.Color(this.scene.colorControls.color2) },
                uColor3: { value: new THREE.Color(this.scene.colorControls.color3) },
                uAlpha: { value: 1 },
                uRingPos: { value: new THREE.Vector2(0, 0) },
                uRez: {
                    value: new THREE.Vector2(
                        this.scene.renderer.domElement.width,
                        this.scene.renderer.domElement.height
                    ),
                },
                uParticleScale: { value: this.particleScale },
                uPixelRatio: { value: this.scene.pixelRatio },
                uColorScheme: { value: this.colorScheme },
            },
            vertexShader: RENDER_VERTEX_SHADER,
            fragmentShader: RENDER_FRAGMENT_SHADER,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });

        this.mesh = new THREE.Points(geometry, this.renderMaterial);
        this.mesh.position.set(0, 0, 0);
        this.mesh.scale.set(5, 5, 5);
        this.scene.scene.add(this.mesh);
    }

    resize() {
        this.renderMaterial.uniforms.uRez.value = new THREE.Vector2(
            this.scene.renderer.domElement.width,
            this.scene.renderer.domElement.height
        );
        this.renderMaterial.uniforms.uPixelRatio.value = this.scene.pixelRatio;
        this.renderMaterial.needsUpdate = true;
    }

    applyTheme(theme, colorControls) {
        if (!this.renderMaterial) return;

        this.colorScheme = theme === "dark" ? 0 : 1;
        this.renderMaterial.uniforms.uColor1.value.set(colorControls.color1);
        this.renderMaterial.uniforms.uColor2.value.set(colorControls.color2);
        this.renderMaterial.uniforms.uColor3.value.set(colorControls.color3);
        this.renderMaterial.uniforms.uColorScheme.value = this.colorScheme;
        this.renderMaterial.needsUpdate = true;
    }

    update() {
        const dt = this.scene.clock.getElapsedTime() - this.lastTime;
        this.lastTime = this.scene.clock.getElapsedTime();

        const t = (this.noise.getVal(this.scene.time * 0.66 + 94.234) - 0.5) * 2;
        const i = (this.noise.getVal(this.scene.time * 0.75 + 21.028) - 0.5) * 2;

        this.cursorPos.set(t * 0.2, i * 0.1);

        if (this.scene.isIntersecting) {
            this.cursorPos.set(
                this.scene.intersectionPoint.x * 0.175 + t * 0.1,
                this.scene.intersectionPoint.y * 0.175 + i * 0.1
            );
            this.ringPos.set(
                this.ringPos.x + (this.cursorPos.x - this.ringPos.x) * 0.08,
                this.ringPos.y + (this.cursorPos.y - this.ringPos.y) * 0.08
            );
        } else {
            this.cursorPos.set(t * 0.2, i * 0.1);
            this.ringPos.set(
                this.ringPos.x + (this.cursorPos.x - this.ringPos.x) * 0.04,
                this.ringPos.y + (this.cursorPos.y - this.ringPos.y) * 0.04
            );
        }

        this.particleScale =
            this.scene.renderer.domElement.width /
            this.scene.pixelRatio /
            2000 *
            this.scene.particlesScale;

        this.simMaterial.uniforms.uPosition.value = this.everRendered
            ? this.rt1.texture
            : this.posTex;
        this.simMaterial.uniforms.uTime.value = this.scene.clock.getElapsedTime();
        this.simMaterial.uniforms.uDeltaTime.value = dt;
        this.simMaterial.uniforms.uRingRadius.value =
            0.175 +
            Math.sin(this.scene.time * 1) * 0.03 +
            Math.cos(this.scene.time * 3) * 0.02;
        this.simMaterial.uniforms.uRingPos.value = this.ringPos;
        this.simMaterial.uniforms.uRingWidth.value = this.scene.ringWidth;
        this.simMaterial.uniforms.uRingWidth2.value = this.scene.ringWidth2;
        this.simMaterial.uniforms.uRingDisplacement.value = this.scene.ringDisplacement;

        this.renderer.setRenderTarget(this.rt2);
        this.renderer.render(this.simScene, this.simCamera);
        this.renderer.setRenderTarget(null);

        this.renderMaterial.uniforms.uPosition.value = this.everRendered
            ? this.rt2.texture
            : this.posTex;
        this.renderMaterial.uniforms.uTime.value = this.scene.clock.getElapsedTime();
        this.renderMaterial.uniforms.uRingPos.value = this.ringPos;
        this.renderMaterial.uniforms.uParticleScale.value = this.particleScale;
    }

    postRender() {
        const tmp = this.rt1;
        this.rt1 = this.rt2;
        this.rt2 = tmp;
        this.everRendered = true;
    }

    kill() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.rt1.dispose();
        this.rt2.dispose();
        this.posTex.dispose();
        this.simMaterial.dispose();
        this.renderMaterial.dispose();
    }
}
