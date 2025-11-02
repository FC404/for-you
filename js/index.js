// ==========================
// 🎵 爱心弹窗 + 音乐 + 主题切换完整版
// ==========================

// 鼓励语句 & 渐变色
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

// 控制面板：弹窗倍数显示
const popupCountSlider = document.getElementById("popupCountSlider");
const popupCountDisplay = document.getElementById("popupCountDisplay");
popupCountSlider.addEventListener("input", () => popupCountDisplay.textContent = popupCountSlider.value);

// ==========================
// ❤️ 爱心数学函数
// ==========================
function heartXY(t, scaleX, scaleY) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { x: x * scaleX, y: -y * scaleY };
}

// 弹窗飞行动画
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

// ==========================
// ✨ 创建弹窗（按爱心曲线飞入）
// ==========================
function createPopup() {
  const isMobile = window.innerWidth < 700;
  let count = parseInt(popupCountSlider.value);
  if (isMobile) count = Math.min(30, count);

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const baseScale = Math.min(window.innerWidth, window.innerHeight) / (isMobile ? 30 : 35);
  const interval = 100;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
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
      popup.querySelector(".popup-close").addEventListener("click", () => popup.remove());

      // 随机四个方向飞入
      const side = Math.floor(Math.random() * 4);
      const offset = 100;
      let startX, startY;
      switch (side) {
        case 0: startX = Math.random() * window.innerWidth; startY = -offset; break;
        case 1: startX = Math.random() * window.innerWidth; startY = window.innerHeight + offset; break;
        case 2: startX = -offset; startY = Math.random() * window.innerHeight; break;
        case 3: startX = window.innerWidth + offset; startY = Math.random() * window.innerHeight; break;
      }

      // 爱心曲线位置
      const t = 2 * Math.PI * Math.pow(i / count, 0.7);
      const scaleX = baseScale * (isMobile ? 0.8 : 1);
      const scaleY = baseScale;
      const pos = heartXY(t, scaleX, scaleY);

      const targetX = centerX + pos.x;
      const targetY = centerY + pos.y;

      const flyDuration = Math.min(2000, 1200 * 20 / count);
      const stayDuration = Math.max(2000, 4000 * 20 / count);

      flyPopup(popup, startX, startY, targetX, targetY, flyDuration);
      setTimeout(() => popup.remove(), stayDuration);
    }, i * interval);
  }
}
setInterval(createPopup, 1000);

// ==========================
// 🌙 主题切换逻辑
// ==========================
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const dark = document.body.classList.contains("dark-theme");
  const playing = musicIcon.dataset.playing === "true";

  // 切换主题图标
  themeIcon.src = dark ? "images/sun.svg" : "images/moon.svg";

  // 同步切换音乐图标
  musicIcon.src = dark
    ? (playing ? "images/music-pause-light.svg" : "images/music-play-light.svg")
    : (playing ? "images/music-pause-dark.svg" : "images/music-play-dark.svg");
});

// ==========================
// 🎧 音乐播放控制
// ==========================
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const bgMusic = document.getElementById("bgMusic");
let isPlaying = false;

// 🌟 移动端音频解锁（关键）
function unlockAudio() {
  bgMusic.play().then(() => {
    bgMusic.pause();
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('click', unlockAudio);
    console.log('Audio unlocked ✅');
  }).catch(() => {});
}
document.addEventListener('touchstart', unlockAudio);
document.addEventListener('click', unlockAudio);

// 播放/暂停控制
musicButton.addEventListener("click", () => {
  const dark = document.body.classList.contains("dark-theme");
  if (isPlaying) {
    bgMusic.pause();
    musicIcon.src = dark ? "images/music-play-light.svg" : "images/music-play-dark.svg";
    musicIcon.dataset.playing = "false";
  } else {
    bgMusic.play().catch(err => console.log("Play blocked:", err));
    musicIcon.src = dark ? "images/music-pause-light.svg" : "images/music-pause-dark.svg";
    musicIcon.dataset.playing = "true";
  }
  isPlaying = !isPlaying;
});
