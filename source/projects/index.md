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
}
.section-title {
  font-size: 1.6em;
  font-weight: bold;
  margin-bottom: 25px;
  padding-bottom: 12px;
  border-bottom: 3px solid var(--theme-color, #333);
}
.project-card {
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}
.project-card:hover {
  transform: translateY(-5px);
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
    <div class="section-title">造物志</div>
    <div class="project-card">
<img src="https://github-readme-stats.eurkon.com/api/pin/?username=ZXJC-niusile&repo=huawei_carousel_backend&hide_border=true&theme=default" alt="huawei_carousel_backend"/>
    </div>
    <div class="project-card">
<img src="https://github-readme-stats.eurkon.com/api/pin/?username=ZXJC-niusile&repo=JudoPro-Backend&hide_border=true&theme=default" alt="JudoPro-Backend"/>
    </div>
    <div class="project-card">
<img src="https://github-readme-stats.eurkon.com/api/pin/?username=ZXJC-niusile&repo=JudoPro-data&hide_border=true&theme=default" alt="JudoPro-data"/>
    </div>
  </div>

  <div class="project-section">
    <div class="section-title">添砖加瓦</div>
    <div class="project-card">
<img src="https://github-readme-stats.eurkon.com/api/pin/?username=tensorlayer&repo=TensorLayerX&hide_border=true&theme=default" alt="TensorLayerX"/>
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
