/**
 * 工具函数和类 - System B 粒子系统
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

/**
 * 线性映射函数
 * @param {number} n - 输入值
 * @param {number} e - 输入范围���小值
 * @param {number} t - 输入范围最大值
 * @param {number} i - 输出范围最小值
 * @param {number} r - 输出范围最大值
 */
export const mapLinear = (n, e, t, i, r) => ((n - e) * (r - i)) / (t - e) + i;

/**
 * 1D 值噪声生成器
 */
export class ValueNoise1D {
  MAX_VERTICES = 256;
  MAX_VERTICES_MASK = this.MAX_VERTICES - 1;
  amplitude = 1;
  scale = 1;
  r = [];

  constructor() {
    for (let i = 0; i < this.MAX_VERTICES; i++) {
      this.r.push(Math.random());
    }
  }

  getVal(x) {
    const t = x * this.scale;
    const i = Math.floor(t);
    const f = t - i;
    const s = f * f * (3 - 2 * f);
    const idx = i % this.MAX_VERTICES_MASK;
    const idx2 = (idx + 1) % this.MAX_VERTICES_MASK;
    return this.lerp(this.r[idx], this.r[idx2], s) * this.amplitude;
  }

  lerp(a, b, t) {
    return a * (1 - t) + b * t;
  }
}

/**
 * 全局鼠标追踪器
 */
class MouseTracker {
  cursor = new THREE.Vector2();
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  constructor() {
    window.addEventListener("mousemove", (e) => this.onMove(e));
    window.addEventListener("resize", () => {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    });
    this.update();
  }

  onMove(e) {
    this.cursor.x = e.clientX;
    this.cursor.y = e.clientY;
  }

  update() {
    requestAnimationFrame(() => this.update());
  }
}

// 全局单例
export const Yr = new MouseTracker();
