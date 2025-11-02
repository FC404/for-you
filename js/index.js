// ------------------ 数据和样式 ------------------
const messages = [
  "你已经很棒了，坚持下去！", "再努力一点点，离成功更近啦！",
  "别怕慢，只要不停步！", "你值得拥有所有美好的事物！",
  "今天的你，依然闪闪发光！", "失败只是成功的开始！",
  "相信自己，你可以的！", "你的努力，会被世界看到！",
  "每一步都算数！", "你真的是个超棒的人！"
];

const gradients = [
  "linear-gradient(135deg,#ff9a9e,#fad0c4)",
  "linear-gradient(135deg,#a1c4fd,#c2e9fb)",
  "linear-gradient(135deg,#fbc2eb,#a6c1ee)",
  "linear-gradient(135deg,#ffecd2,#fcb69f)",
  "linear-gradient(135deg,#84fab0,#8fd3f4)",
  "linear-gradient(135deg,#fccb90,#d57eeb)",
  "linear-gradient(135deg,#a1ffce,#faffd1)"
];

let activePopups = [];         // 当前屏幕上所有弹窗
const MAX_POPUPS = 83;         // 累积达到 83 个就淡出清空

// ------------------ 心形函数 ------------------
function heartXY(t, scaleX, scaleY) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { x: x * scaleX, y: -y * scaleY };
}

// ------------------ 弹窗飞行动画 ------------------
function flyPopup(popup, startX, startY, targetX, targetY, duration) {
  const startTime = performance.now();
  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 0.5 - 0.5 * Math.cos(Math.PI * progress);
    popup.style.left = startX + (targetX - startX) * ease + "px";
    popup.style.top = startY + (targetY - startY) * ease + "px";
    popup.style.opacity = ease;
    if (progress < 1) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

// ------------------ 创建一批心形弹窗 ------------------
function createHeartBatch() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const baseScale = Math.min(window.innerWidth, window.innerHeight) / 35;
  const totalPoints = 50;  // 每批生成的弹窗数量
  const flyDuration = 1500;
  const stayDuration = 7000;
  const interval = 100;

  for (let i = 0; i < totalPoints; i++) {
    setTimeout(() => {
      // 累积计数，超过 MAX_POPUPS 就淡出清空
      if (activePopups.length >= MAX_POPUPS) {
        activePopups.forEach(p => {
          p.style.transition = "opacity 0.5s";
          p.style.opacity = 0;
          setTimeout(() => p.remove(), 500);
        });
        activePopups = [];
      }

      const msg = messages[Math.floor(Math.random() * messages.length)];
      const popup = document.createElement("div");
      popup.className = "popup";
      popup.innerHTML = `
        <div class="popup-header">
          <span>💌 鼓励</span>
          <span class="popup-close">×</span>
        </div>
        <div class="popup-content">${msg}</div>
      `;
      popup.style.background = gradients[Math.floor(Math.random() * gradients.length)];
      document.body.appendChild(popup);
      activePopups.push(popup);

      popup.querySelector(".popup-close").addEventListener("click", () => {
        popup.style.transition = "opacity 0.5s";
        popup.style.opacity = 0;
        setTimeout(() => {
          popup.remove();
          activePopups = activePopups.filter(p => p !== popup);
        }, 500);
      });

      const t = 2 * Math.PI * (i / totalPoints);
      const pos = heartXY(t, baseScale, baseScale);
      const targetX = centerX + pos.x;
      const targetY = centerY + pos.y;

      const side = Math.floor(Math.random() * 4);
      const offset = 100;
      let startX, startY;
      switch (side) {
        case 0: startX = Math.random() * window.innerWidth; startY = -offset; break;
        case 1: startX = Math.random() * window.innerWidth; startY = window.innerHeight + offset; break;
        case 2: startX = -offset; startY = Math.random() * window.innerHeight; break;
        case 3: startX = window.innerWidth + offset; startY = Math.random() * window.innerHeight; break;
      }

      flyPopup(popup, startX, startY, targetX, targetY, flyDuration);

      // 自动消失
      setTimeout(() => {
        popup.style.transition = "opacity 0.5s";
        popup.style.opacity = 0;
        setTimeout(() => {
          popup.remove();
          activePopups = activePopups.filter(p => p !== popup);
        }, 500);
      }, flyDuration + stayDuration);

    }, i * interval);
  }

  setTimeout(() => createHeartBatch(), totalPoints * interval + 200);
}

// ------------------ 开始生成 ------------------
createHeartBatch();

// ------------------ 主题切换 ------------------
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const musicIcon = document.getElementById("musicIcon");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const dark = document.body.classList.contains("dark-theme");
  const playing = musicIcon.dataset.playing === "true";
  themeIcon.src = dark ? "images/sun.svg" : "images/moon.svg";
  musicIcon.src = dark
    ? (playing ? "images/music-pause-light.svg" : "images/music-play-light.svg")
    : (playing ? "images/music-pause-dark.svg" : "images/music-play-dark.svg");
});

// ------------------ 音乐按钮 ------------------
const musicButton = document.getElementById("musicButton");
const bgMusic = document.getElementById("bgMusic");
let isPlaying = false;

musicButton.addEventListener("click", async () => {
  const dark = document.body.classList.contains("dark-theme");
  if (!isPlaying) {
    try {
      await bgMusic.play();
      musicIcon.src = dark ? "images/music-pause-light.svg" : "images/music-pause-dark.svg";
      musicIcon.dataset.playing = "true";
      isPlaying = true;
    } catch (err) {
      console.log("播放被阻止:", err);
    }
  } else {
    bgMusic.pause();
    musicIcon.src = dark ? "images/music-play-light.svg" : "images/music-play-dark.svg";
    musicIcon.dataset.playing = "false";
    isPlaying = false;
  }
});
