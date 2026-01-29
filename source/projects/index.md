---
title: 项目
date: 2026-01-27 11:10:20
---

<style>
.projects-title {
  text-align: center;
  font-size: 2.8em;
  font-weight: bold;
  margin-bottom: 50px;
  margin-top: 30px;
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 40px;
}
.project-section {
  padding: 0;
  position: relative;
  overflow: hidden;
}
.project-section::before {
  content: attr(data-subtitle);
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%) rotate(-8deg);
  font-size: 1.2em;
  font-weight: bold;
  color: var(--theme-color, #333);
  opacity: 0.08;
  white-space: nowrap;
  pointer-events: none;
  z-index: 0;
  letter-spacing: 2px;
}
.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 1.6em;
  font-weight: bold;
  margin-bottom: 25px;
  padding-bottom: 0;
  border-bottom: none;
}
.section-title::before,
.section-title::after {
  content: '';
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--theme-color, #4a9eff), transparent);
}
.section-title::before {
  margin-right: 20px;
  background: linear-gradient(90deg, transparent, var(--theme-color, #4a9eff));
}
.section-title::after {
  margin-left: 20px;
  background: linear-gradient(90deg, var(--theme-color, #4a9eff), transparent);
}
.section-title span {
  position: relative;
  z-index: 1;
  padding: 0 10px;
}
.project-card {
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
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
  .project-section::before {
    font-size: 1em;
    top: 40px;
  }
}
</style>

<div class="projects-title">折腾记录</div>

<div class="projects-grid">
  <div class="project-section" data-subtitle="自己写的小玩意">
    <div class="section-title"><span>造物志</span></div>
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

  <div class="project-section" data-subtitle="成为大佬们的contributor">
    <div class="section-title"><span>添砖加瓦</span></div>
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
