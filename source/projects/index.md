---
title: 项目
date: 2026-01-27 11:10:20
---

<style>
/* ========== 大标题：方案5 镜像倒影效果 ========== */
.projects-title {
  text-align: center;
  font-size: 2.8em;
  font-weight: bold;
  margin-bottom: 60px;
  margin-top: 30px;
  position: relative;
}
.projects-title::after {
  content: "折腾记录";
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  transform: scaleY(-1);
  background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  pointer-events: none;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 40px;
}
.project-section {
  padding: 0;
}

/* ========== 小标题：方案10 Glitch故障艺术效果（增强版） ========== */
.section-title {
  position: relative;
  text-align: center;
  font-size: 1.6em;
  font-weight: bold;
  margin-bottom: 25px;
  padding-bottom: 0;
}
.section-title span {
  position: relative;
  display: inline-block;
  transform: skewX(8deg);
  color: var(--theme-color, #333);
  text-shadow: 
    2px 2px 0 rgba(255, 0, 64, 0.4),
    -2px -1px 0 rgba(0, 255, 255, 0.4);
}
/* Glitch 红色偏移层 */
.section-title span::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 3px;
  color: #ff0040;
  opacity: 0.7;
  z-index: -1;
  clip-path: inset(10% 0 60% 0);
  text-shadow: none;
}

/* ========== 映射文字：方案6 打字机/代码风格 ========== */
.section-title span::before {
  content: attr(data-shadow);
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translateX(-50%) skewX(-15deg);
  font-size: 0.75em;
  font-weight: 500;
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  color: var(--theme-color, #555);
  opacity: 0.25;
  white-space: nowrap;
  pointer-events: none;
  z-index: -2;
  letter-spacing: 1px;
  border-bottom: 2px solid rgba(0,0,0,0.15);
  padding-bottom: 2px;
}

.project-card {
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}
.project-card:hover {
  transform: translateY(-5px);
}
.project-card a {
  display: block;
  text-decoration: none;
}
.project-card img {
  max-width: 100%;
  height: auto;
  display: block;
}
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  .projects-title {
    font-size: 2em;
    text-align: center;
  }
}
</style>

<div class="projects-title">折腾记录</div>

<div class="projects-grid">
  <div class="project-section">
    <div class="section-title"><span data-shadow="自己写的小玩意" data-text="造物志">造物志</span></div>
    <div class="project-card">
      <a href="https://github.com/ZXJC-niusile/huawei_carousel_backend" target="_blank">
        <img src="https://github-readme-stats.eurkon.com/api/pin/?username=ZXJC-niusile&repo=huawei_carousel_backend&hide_border=true&theme=default" alt="huawei_carousel_backend"/>
      </a>
    </div>
    <div class="project-card">
      <a href="https://github.com/ZXJC-niusile/JudoPro-Backend" target="_blank">
        <img src="https://github-readme-stats.eurkon.com/api/pin/?username=ZXJC-niusile&repo=JudoPro-Backend&hide_border=true&theme=default" alt="JudoPro-Backend"/>
      </a>
    </div>
    <div class="project-card">
      <a href="https://github.com/ZXJC-niusile/JudoPro-data" target="_blank">
        <img src="https://github-readme-stats.eurkon.com/api/pin/?username=ZXJC-niusile&repo=JudoPro-data&hide_border=true&theme=default" alt="JudoPro-data"/>
      </a>
    </div>
  </div>

  <div class="project-section">
    <div class="section-title"><span data-shadow="CONTRIBUTOR" data-text="添砖加瓦">添砖加瓦</span></div>
    <div class="project-card">
      <a href="https://github.com/tensorlayer/TensorLayerX" target="_blank">
        <img src="https://github-readme-stats.eurkon.com/api/pin/?username=tensorlayer&repo=TensorLayerX&hide_border=true&theme=default" alt="TensorLayerX"/>
      </a>
    </div>
  </div>
</div>

<script>
(function() {
  // 根据主题切换卡片图片
  function updateCardTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                   document.body.classList.contains('dark-mode');
    const theme = isDark ? 'dark' : 'light';
    const images = document.querySelectorAll('.project-card img');

    images.forEach(img => {
      const src = img.src;
      if (src.includes('theme=default')) {
        const newSrc = src.replace('theme=default', 'theme=' + theme);
        if (img.src !== newSrc) {
          img.src = newSrc;
        }
      }
    });
  }

  // 初始更新
  updateCardTheme();

  // 监听主题变化
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'data-theme') {
        updateCardTheme();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // 也监听 body 的 class 变化
  const bodyObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        updateCardTheme();
      }
    });
  });

  bodyObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
})();
</script>
