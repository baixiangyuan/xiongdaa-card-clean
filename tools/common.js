// ================= 共享工具脚本 - bxya 工具集 =================
// 背景系统、夜间模式、Toast、点击特效、时钟

// --- Toast ---
let toastTimer;
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toast-msg').innerText = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- 日志系统（简化版，仅用于工具页面） ---
function printLog(title, data, isError) {
    if (isError) console.error(`[${title}]`, data);
    else console.log(`%c[${title}]`, 'color: #a5b4fc; font-weight: bold;', data);
}

// --- 时钟 ---
function updateClock() {
    const el = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');
    if (!el || !dateEl) return;
    const now = new Date();
    el.innerText = now.toLocaleTimeString('zh-CN', { hour12: false });
    dateEl.innerText = now.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
if (document.getElementById('clock-time')) {
    setInterval(updateClock, 1000);
    updateClock();
}

// --- 夜间模式 ---
const NIGHT_MODE_KEY = 'bxy_night_mode';
function initNightMode() {
    try {
        const stored = localStorage.getItem(NIGHT_MODE_KEY);
        if (stored === 'true') {
            document.documentElement.classList.add('night-mode');
            updateNightModeBtn(true);
        } else if (stored === 'false') {
            updateNightModeBtn(false);
        }
    } catch (e) {}
}
function toggleNightMode() {
    const isNight = document.documentElement.classList.toggle('night-mode');
    updateNightModeBtn(isNight);
    try { localStorage.setItem(NIGHT_MODE_KEY, isNight.toString()); } catch (e) {}
}
function updateNightModeBtn(isNight) {
    const btn = document.getElementById('night-mode-btn');
    if (!btn) return;
    if (isNight) {
        btn.classList.add('night-active');
        btn.innerHTML = '<i class="fas fa-sun"></i>';
        btn.title = '关闭夜间模式';
    } else {
        btn.classList.remove('night-active');
        btn.innerHTML = '<i class="fas fa-moon"></i>';
        btn.title = '开启夜间模式';
    }
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    try {
        const stored = localStorage.getItem(NIGHT_MODE_KEY);
        if (stored === null) {
            if (e.matches) {
                document.documentElement.classList.add('night-mode');
                updateNightModeBtn(false);
            } else {
                document.documentElement.classList.remove('night-mode');
                updateNightModeBtn(false);
            }
        }
    } catch (e) {}
});

// --- 背景系统 ---
const BG_KEY = 'bxy_bg';
const BG_TYPE_KEY = 'bxy_bg_type';
const BING_API = 'https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=zh-CN';
const DEFAULT_BG = 'https://img.8845.top/acg';
let currentVideoScale = 'cover';

function isVideoUrl(url) {
    if (!url) return false;
    return ['.mp4', '.webm', '.ogg', '.mov'].some(ext => url.toLowerCase().endsWith(ext));
}

function initBg() {
    try {
        const stored = localStorage.getItem(BG_KEY);
        const storedType = localStorage.getItem(BG_TYPE_KEY);
        const savedScale = localStorage.getItem('bxy_video_scale');
        if (savedScale) currentVideoScale = savedScale;
        if (stored) {
            if (storedType === 'video' || isVideoUrl(stored)) {
                setVideoBg(stored);
            } else {
                setImageBg(stored);
            }
        } else {
            setImageBg(DEFAULT_BG);
        }
    } catch (e) {
        setImageBg(DEFAULT_BG);
    }
}

function setImageBg(url) {
    const videoEl = document.getElementById('bg-video');
    if (videoEl) {
        videoEl.classList.remove('active');
        videoEl.pause();
        videoEl.src = '';
        videoEl.load();
    }
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
}

function setVideoBg(url) {
    const videoEl = document.getElementById('bg-video');
    if (!videoEl) return;
    document.body.style.backgroundImage = 'none';
    videoEl.classList.add('active');
    videoEl.src = url;
    videoEl.load();
    videoEl.play().catch(e => printLog('视频背景播放失败', e.message, true));
    applyVideoScale();
    videoEl.onerror = function() { printLog('视频背景加载失败', '无法加载视频', true); };
}

function applyVideoScale() {
    const videoEl = document.getElementById('bg-video');
    if (!videoEl) return;
    if (currentVideoScale === 'cover') {
        videoEl.removeAttribute('data-scale');
    } else {
        videoEl.setAttribute('data-scale', currentVideoScale);
    }
}

async function loadBingBg() {
    try {
        const proxyUrl = `https://cros.bxya.top/?url=${encodeURIComponent(BING_API)}`;
        const resp = await fetch(proxyUrl);
        const data = await resp.json();
        if (data && data.url) {
            setImageBg(data.url);
            try {
                localStorage.setItem(BG_KEY, data.url);
                localStorage.setItem(BG_TYPE_KEY, 'image');
            } catch (e) {}
            return data.url;
        }
    } catch (e) {
        printLog('Bing 背景获取失败', e.message, true);
    }
    return null;
}

// --- 点击特效（用在工具页面） ---
function createClickEffect(e) {
    const x = e.clientX;
    const y = e.clientY;
    // 波纹
    const ripple = document.createElement('div');
    ripple.className = 'click-effect';
    ripple.style.left = (x - 50) + 'px';
    ripple.style.top = (y - 50) + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    // 爱心
    if (Math.random() > 0.6) {
        const heart = document.createElement('div');
        heart.className = 'click-heart';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.left = (x - 10) + 'px';
        heart.style.top = (y - 10) + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1200);
    }
    // 粒子
    const particleCount = 6 + Math.floor(Math.random() * 6);
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'click-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.5;
        const distance = 30 + Math.random() * 50;
        particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        const colors = ['#a5b4fc', '#f472b6', '#60a5fa', '#34d399', '#fbbf24'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
}

// --- 天气小组件 ---
async function loadWeather() {
    const widget = document.getElementById('weather-widget');
    if (!widget) return;
    try {
        const geo = await fetch('https://api.ip.sb/geoip').then(r => r.json());
        if (typeof printLog === 'function') {
            printLog('位置信息', geo, false, 'weather');
        } else {
            console.log('位置信息', geo);
        }
        const lat = geo.latitude || 39.9;
        const lon = geo.longitude || 116.4;
        const cityName = geo.city || '未知';
        const country = geo.country_name || '';
        const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
        const wResp = await fetch(wUrl);
        const wData = await wResp.json();
        if (typeof printLog === 'function') {
            printLog('天气数据响应', wData, false, 'weather');
        } else {
            console.log('天气数据响应', wData);
        }
        
        const cur = wData.current || {};
        const daily = wData.daily || {};
        
        const temp = Math.round(cur.temperature_2m || 25);
        const apparentTemp = Math.round(cur.apparent_temperature || temp);
        const humidity = cur.relative_humidity_2m || 0;
        const windSpeed = cur.wind_speed_10m || 0;
        const code = cur.weather_code || 0;
        const updateTime = cur.time ? cur.time.split('T')[1] : '';
        
        const maxTemp = daily.temperature_2m_max && daily.temperature_2m_max[0] !== undefined ? Math.round(daily.temperature_2m_max[0]) : '--';
        const minTemp = daily.temperature_2m_min && daily.temperature_2m_min[0] !== undefined ? Math.round(daily.temperature_2m_min[0]) : '--';
        
        const wMap = {
            0:['晴','fa-sun'],1:['多云','fa-cloud-sun'],2:['多云','fa-cloud-sun'],3:['阴天','fa-cloud'],
            45:['雾','fa-smog'],48:['雾','fa-smog'],
            51:['毛毛雨','fa-cloud-showers-heavy'],53:['毛毛雨','fa-cloud-showers-heavy'],55:['毛毛雨','fa-cloud-showers-heavy'],
            56:['冻雨','fa-cloud-showers-heavy'],57:['冻雨','fa-umbrella'],
            61:['小雨','fa-cloud-showers-heavy'],63:['中雨','fa-umbrella'],65:['大雨','fa-umbrella'],
            66:['冻雨','fa-umbrella'],67:['冻雨','fa-umbrella'],
            71:['小雪','fa-snowflake'],73:['中雪','fa-snowflake'],75:['大雪','fa-snowflake'],
            77:['小雪','fa-snowflake'],80:['阵雨','fa-cloud-showers-heavy'],81:['阵雨','fa-umbrella'],82:['暴雨','fa-umbrella'],
            85:['阵雪','fa-snowflake'],86:['阵雪','fa-snowflake'],
            95:['雷雨','fa-bolt'],96:['雷雨','fa-bolt'],99:['雷雨','fa-bolt']
        };
        const [desc, icon] = wMap[code] || ['多云', 'fa-cloud'];
        
        widget.innerHTML = `
            <div class="weather-icon"><i class="fas ${icon}"></i></div>
            <div class="weather-info">
                <div class="weather-temp">${temp}°C</div>
                <div class="weather-desc">${desc} · ${minTemp}°~${maxTemp}°<br>体感 ${apparentTemp}°C · 湿度 ${humidity}% · 风速 ${windSpeed}km/h</div>
                <div class="weather-city" style="margin-top:4px;"><i class="fas fa-map-marker-alt"></i> ${cityName}${country ? ' · ' + country : ''}${updateTime ? ' · ' + updateTime : ''}</div>
            </div>
        `;
    } catch (e) {
        if (typeof printLog === 'function') {
            printLog('天气获取失败', e.message, true, 'weather');
        } else {
            console.error('天气获取失败', e);
        }
        widget.innerHTML = '<div class="weather-loading"><i class="fas fa-cloud"></i> 天气加载失败</div>';
    }
}
if (document.getElementById('weather-widget')) {
    loadWeather();
}

// --- 复制工具 ---
function copyText(text) {
    if (!text) { showToast('没有内容可复制'); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => showToast('已复制到剪贴板')).catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}
function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('已复制到剪贴板');
}
// 点击输出框复制
document.addEventListener('click', function(e) {
    const output = e.target.closest('.tool-output');
    if (output) {
        const text = output.textContent.replace('📋 点击复制', '').trim();
        copyText(text);
    }
});

// --- 初始化 ---
document.addEventListener('DOMContentLoaded', function() {
    initNightMode();
    initBg();
    initMouseEffects();
});

// ================= 鼠标替换 - 同心圆光标 + 飞机尾迹拖尾 =================
let cursorEl = null;

function initMouseEffects() {
    // 触摸设备（手机/平板）不启用自定义光标与尾迹，恢复系统光标并节省性能
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches || 'ontouchstart' in window) return;
    // 同心圆光标
    cursorEl = document.createElement('div');
    cursorEl.id = 'cursor-concentric';
    cursorEl.innerHTML = `
        <div class="outer" style="width:36px;height:36px;"></div>
        <div class="inner" style="width:18px;height:18px;"></div>
        <div class="dot"></div>
    `;
    document.body.appendChild(cursorEl);

    // --- 飞机尾迹 Canvas ---
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-trail-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99998;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // 窗口缩放时更新 canvas 尺寸
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // 轨迹点队列：存储 {x, y, time}
    const trailPoints = [];
    const TRAIL_LENGTH = 60;    // 最多保留 60 个点
    const TRAIL_DURATION = 600; // 每个点存活 600ms

    // 鼠标移动记录点
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX, y = e.clientY;

        // 更新光标位置
        cursorEl.style.left = x + 'px';
        cursorEl.style.top = y + 'px';
        cursorEl.classList.add('active');

        // 记录轨迹点（去重，防止同一位置堆积）
        const last = trailPoints[trailPoints.length - 1];
        if (!last || Math.abs(last.x - x) > 2 || Math.abs(last.y - y) > 2) {
            trailPoints.push({ x, y, time: Date.now() });
            if (trailPoints.length > TRAIL_LENGTH) {
                trailPoints.shift();
            }
        }
    });

    // 动画循环 - 绘制尾迹
    function drawTrail() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const now = Date.now();
        // 过滤掉过期的点
        while (trailPoints.length > 0 && now - trailPoints[0].time > TRAIL_DURATION) {
            trailPoints.shift();
        }
        if (trailPoints.length < 3) {
            requestAnimationFrame(drawTrail);
            return;
        }

        // 彩虹色系循环
        const hueOffset = (now * 0.05) % 360;

        // 从尾到头绘制（老的点先画，新的点覆盖在上面）
        for (let i = 1; i < trailPoints.length; i++) {
            const p0 = trailPoints[i - 1];
            const p1 = trailPoints[i];
            const age = (now - p1.time) / TRAIL_DURATION; // 0=最新, 1=最老

            // 飞机尾迹效果：越老越细越透明
            const opacity = Math.max(0, 1 - age * 1.2);
            const lineWidth = Math.max(0.3, 6 * (1 - age * 1.1));

            // 彩色：沿着轨迹从紫到粉到蓝渐变
            const hue = (hueOffset + i * 8) % 360;
            const color = `hsla(${hue}, 80%, 65%, ${opacity})`;

            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            // 再加一层发光效果
            if (opacity > 0.3) {
                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.strokeStyle = `hsla(${hue}, 90%, 75%, ${opacity * 0.3})`;
                ctx.lineWidth = lineWidth * 2.5;
                ctx.stroke();
            }
        }

        requestAnimationFrame(drawTrail);
    }
    drawTrail();

    // 鼠标点击 - 波纹扩散
    document.addEventListener('mousedown', function() {
        cursorEl.classList.add('click');
        setTimeout(() => cursorEl.classList.remove('click'), 500);
    });

    // 离开/进入窗口
    document.addEventListener('mouseleave', function() {
        cursorEl.classList.remove('active');
    });
    document.addEventListener('mouseenter', function() {
        cursorEl.classList.add('active');
    });

    // 链接和按钮上放大变色
    document.addEventListener('mouseover', function(e) {
        const target = e.target.closest('a, button, .tool-item, .link-btn, .control-btn, .sidebar-link, .tool-btn, .bio-tag, .music-item, .bg-option');
        if (target) {
            cursorEl.style.transform = 'translate(-50%, -50%) scale(1.4)';
            cursorEl.querySelector('.outer').style.borderColor = '#f472b6';
            cursorEl.querySelector('.inner').style.borderColor = 'rgba(244,114,182,0.7)';
            cursorEl.querySelector('.dot').style.background = '#f472b6';
            cursorEl.querySelector('.dot').style.boxShadow = '0 0 10px rgba(244,114,182,0.6), 0 0 20px rgba(244,114,182,0.3)';
        }
    });
    document.addEventListener('mouseout', function(e) {
        const target = e.target.closest('a, button, .tool-item, .link-btn, .control-btn, .sidebar-link, .tool-btn, .bio-tag, .music-item, .bg-option');
        if (target) {
            cursorEl.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorEl.querySelector('.outer').style.borderColor = '#a5b4fc';
            cursorEl.querySelector('.inner').style.borderColor = 'rgba(165,180,252,0.7)';
            cursorEl.querySelector('.dot').style.background = '#a5b4fc';
            cursorEl.querySelector('.dot').style.boxShadow = '0 0 10px rgba(165,180,252,0.6), 0 0 20px rgba(165,180,252,0.3)';
        }
    });

    // 移动端触摸时隐藏
    document.addEventListener('touchstart', function() {
        cursorEl.classList.remove('active');
    });
}
