// ================= 共享主页脚本 - xiongdaa 个人主页 (所有主题共用) =================

// ================= HTML转义 =================
function escapeHtml(str){ if(!str) return ''; return String(str).replace(/[&<>]/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;'}[m];}); }

let currentLogFilter = 'all';
function printLog(title, data, isError = false, category = 'system') {
    if(isError) console.error(`[${title}]`, data);
    else console.log(`%c[${title}]`, 'color: #ffffff; font-weight: bold;', data);
    const contentDiv = document.getElementById('log-content');
    if(!contentDiv) return;
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const div = document.createElement('div');
    div.className = 'log-item';
    div.dataset.category = category;
    div.dataset.isError = isError ? 'true' : 'false';
    if(currentLogFilter !== 'all') {
        if(currentLogFilter === 'error' && !isError) div.classList.add('log-hidden');
        else if(currentLogFilter !== category) div.classList.add('log-hidden');
    }
    const catClass = isError ? 'cat-error' : `cat-${category}`;
    const catNames = { system:'系统', player:'播放器', api:'API', lyrics:'歌词', weather:'天气', error:'错误' };
    const catLabel = isError ? '错误' : (catNames[category] || category);
    let dataStr = '';
    if(typeof data === 'object') { try { dataStr = JSON.stringify(data, null, 2); } catch(e) { dataStr = String(data); } }
    else dataStr = String(data);
    div.innerHTML = `<div class="log-time">[${time}] <span class="log-cat-badge ${catClass}">${catLabel}</span></div><div class="log-title ${catClass}">${title}</div><pre class="${isError?'log-error':'log-data'}">${escapeHtml(dataStr)}</pre>`;
    contentDiv.prepend(div);
}

// ================= Toast =================
let toastTimer;
function showToast(msg) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    document.getElementById('toast-msg').innerText = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ================= 时钟 =================
function updateClock() {
    const now = new Date();
    const el = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');
    if(el) el.innerText = now.toLocaleTimeString('zh-CN', { hour12: false });
    if(dateEl) dateEl.innerText = now.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateClock, 1000); updateClock();

const STARTUP_DATE = new Date("2026-06-11T00:00:00");
function updateUptime() {
    const now = new Date();
    const diff = now - STARTUP_DATE;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const el = document.getElementById('uptime-days');
    const hmsEl = document.getElementById('uptime-hms');
    if(el) el.innerText = days + '天' + hours + '小时' + minutes + '分' + seconds + '秒';
    if(hmsEl) hmsEl.innerText = '';
}
setInterval(updateUptime, 1000);
updateUptime();

// ================= 打字机效果 =================
let textToType = "正在连接异世界的数据节点...";
let typeIndex = 0;
function typeWriter() {
    const el = document.getElementById('typed-text');
    if(!el) return;
    if(typeIndex < textToType.length) { el.innerHTML += textToType.charAt(typeIndex); typeIndex++; setTimeout(typeWriter, 80); }
}
typeWriter();
printLog('系统初始化', '正在拉取动漫一言...', false, 'system');
fetch('https://v1.hitokoto.cn/?c=a&c=b').then(r=>r.json()).then(data=>{
    const el = document.getElementById('typed-text'); if(!el) return;
    el.innerHTML = ""; textToType = `${data.hitokoto} — ⌈${data.from}⌋`; typeIndex = 0; typeWriter();
}).catch(()=>{
    const el = document.getElementById('typed-text'); if(!el) return;
    el.innerHTML = ""; textToType = "心之所向，素履以往。"; typeIndex = 0; typeWriter();
});

// ================= openApp =================
function openApp(type, id) {
    if(type === 'qq') {
        showToast('正在尝试唤起 QQ...');
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        setTimeout(() => window.location.href = isMobile ? `mqqwpa://im/chat?chat_type=wpa&uin=${id}&version=1&src_type=web` : `tencent://message/?uin=${id}&Site=Website&Menu=yes`, 500);
    } else if(type === 'wechat') {
        const input = document.createElement('input'); input.value = id; document.body.appendChild(input);
        input.select(); document.execCommand('copy'); document.body.removeChild(input);
        showToast('微信号已复制，正在唤起微信...');
        setTimeout(() => window.location.href = 'weixin://', 800);
    }
}

// ================= 播放器引擎 =================
function formatTime(sec) { if(!sec||isNaN(sec)) return "00:00"; return Math.floor(sec/60).toString().padStart(2,'0')+':'+Math.floor(sec%60).toString().padStart(2,'0'); }
const audio = new Audio();
let currentPlaylist = [], currentIndex = -1;
const uiVinyl = document.getElementById('vinyl-record');
const uiCover = document.getElementById('player-cover');
const uiTitle = document.getElementById('player-title');
const uiArtist = document.getElementById('player-artist');
const uiSourceTag = document.getElementById('player-source-tag');
const uiPlayIcon = document.getElementById('play-pause-icon');
const uiProgressFill = document.getElementById('progress-fill');
const uiProgressContainer = document.getElementById('progress-container');

audio.addEventListener('play', () => { if(uiPlayIcon) uiPlayIcon.className='fas fa-pause'; if(uiVinyl) uiVinyl.classList.add('playing'); });
audio.addEventListener('pause', () => { if(uiPlayIcon) uiPlayIcon.className='fas fa-play'; if(uiVinyl) uiVinyl.classList.remove('playing'); });
audio.addEventListener('ended', () => { printLog('播放器','歌曲播放结束，自动切下一首',false,'player'); playNext(); });
audio.addEventListener('play', () => { const song = currentPlaylist[currentIndex]; if(song) addPlayHistory(song); });
audio.addEventListener('timeupdate', () => { if(audio.duration && uiProgressFill) uiProgressFill.style.width = (audio.currentTime/audio.duration)*100+'%'; updateLyricSync(); });

let consecutiveFailures = 0;
let currentLyrics = [], lyricLineElements = [];
let lyricUserScrolling = false, lyricScrollTimer = null, autoScrolling = false;
let lastActiveLyricIndex = -1;

function togglePlay() { if(currentIndex===-1){showToast('请先在下方搜索并选择一首歌曲哦');return;} if(audio.paused)audio.play();else audio.pause(); }
function playPrev() { if(!currentPlaylist.length)return; let i=currentIndex-1; if(i<0)i=currentPlaylist.length-1; playSongByIndex(i,true); }
function playNext() { if(!currentPlaylist.length)return; let i=currentIndex+1; if(i>=currentPlaylist.length)i=0; playSongByIndex(i,true); }
function seekAudio(e) { if(!audio.duration)return; const r=uiProgressContainer.getBoundingClientRect(); audio.currentTime=(e.clientX-r.left)/r.width*audio.duration; }

function playSongByIndex(index, isAutoSkip=false) {
    if(index<0||index>=currentPlaylist.length) return;
    const song = currentPlaylist[index];
    if(song.isVip) { if(!isAutoSkip) showToast('该歌曲为 VIP 专属版权，无法直接播放哦'); else playNext(); return; }
    if(!song.url) { showToast('获取播放链接失败'); return; }
    currentIndex = index;
    if(uiTitle) uiTitle.innerText = song.name;
    if(uiArtist) uiArtist.innerText = song.artist;
    if(uiSourceTag) uiSourceTag.innerText = song.source;
    if(uiCover) uiCover.src = song.cover || 'https://q1.qlogo.cn/g?b=qq&nk=2700896261&s=640';
    document.querySelectorAll('.music-item').forEach((el,i)=>{ if(i===index)el.classList.add('active');else el.classList.remove('active'); });
    audio.src = song.url;
    printLog('播放器',`正在加载: ${song.name} - ${song.artist}`,false,'player');
    loadLyricsForSong(song);
    audio.play().catch(e => {
        printLog('播放器','播放失败: '+(e.message||e),true,'player');
        if(e.name==='NotAllowedError') showToast('请点击页面后再播放音乐哦~');
        else if(e.name==='NotSupportedError' && song.source==='网易云') { showToast(`《${song.name}》为 VIP 专属，自动跳过`); song.isVip=true; setTimeout(()=>playNext(),2000); }
    });
}

function handlePlaybackFailure(song) {
    consecutiveFailures++;
    printLog('播放器错误',`连续失败次数: ${consecutiveFailures}`,true,'player');
    if(song && song.source==='网易云') { showToast(`《${song.name}》为 VIP 或无版权歌曲，自动跳过`); song.isVip=true; setTimeout(()=>playNext(),2000); }
    else { showToast('播放失败，音频地址可能已失效'); setTimeout(()=>playNext(),1500); }
    if(uiPlayIcon) uiPlayIcon.className='fas fa-play';
    if(uiVinyl) uiVinyl.classList.remove('playing');
}

const musicListDiv = document.getElementById('musicListArea');
function renderMusicList(songs, sourceType) {
    if(!songs||!songs.length){ musicListDiv.innerHTML='<div class="status-msg"><i class="fas fa-box-open"></i> 未找到歌曲，换个关键词吧</div>'; return; }
    songs.forEach(s=>s.source=sourceType);
    currentPlaylist=songs; currentIndex=-1; musicListDiv.innerHTML='';
    songs.forEach((song,idx)=>{
        const div=document.createElement('div'); div.className='music-item';
        const vipTag=song.isVip?'<span style="color:#ff4757;font-size:0.7rem;margin-left:5px;border:1px solid #ff4757;padding:0 3px;border-radius:3px;">VIP</span>':'';
        div.innerHTML=`<div class="play-icon"><i class="fas fa-play"></i></div><div class="music-info"><div class="music-name">${escapeHtml(song.name)} ${vipTag}</div><div class="music-artist">${escapeHtml(song.artist)}</div></div><div class="music-duration">${song.duration||'00:00'}</div><div class="source-tag">${sourceType}</div>`;
        div.onclick=()=>playSongByIndex(idx);
        musicListDiv.appendChild(div);
    });
}

// ================= 歌词系统 =================
function toggleLyricPanel() {
    const p=document.getElementById('lyric-panel'), b=document.getElementById('lyric-trigger-btn');
    if(p)p.classList.toggle('show'); if(b)b.classList.toggle('active');
}
function parseLRC(lrcText) {
    if(!lrcText) return [];
    const result=[]; lrcText.split('\n').forEach(line=>{
        const ms=line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/g);
        if(ms){let t=line;ms.forEach(m=>{t=t.replace(m,'');});t=t.trim();if(!t)return;
        ms.forEach(m=>{const p=m.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/);result.push({time:parseInt(p[1])*60+parseInt(p[2])+parseInt(p[3].padEnd(3,'0'))/1000,text:t});});}
    }); result.sort((a,b)=>a.time-b.time); return result;
}
async function fetchNeteaseLyric(songId) {
    const proxyUrl=`https://cros.xiongdaa.me/?url=${encodeURIComponent('https://music.163.com/api/song/lyric?os=pc&id='+songId+'&kv=-1&tv=-1')}`;
    printLog('获取网易云歌词',proxyUrl,false,'lyrics');
    try{ const r=await fetch(proxyUrl); const d=await r.json(); let l=''; if(d.lrc&&d.lrc.lyric)l=d.lrc.lyric; else if(d.tlyric&&d.tlyric.lyric)l=d.tlyric.lyric; return l; }
    catch(e){ printLog('网易云歌词获取失败',e.message,true,'lyrics'); return ''; }
}
function renderLyrics(lyrics) {
    const c=document.getElementById('lyric-content'); if(!c)return;
    currentLyrics=lyrics; lyricLineElements=[]; lastActiveLyricIndex=-1;
    if(!lyrics||!lyrics.length){c.innerHTML='<div class="lyric-empty"><i class="fas fa-file-alt"></i> 暂无歌词</div>';return;}
    c.innerHTML=''; lyrics.forEach(l=>{const d=document.createElement('div');d.className='lyric-line';d.textContent=l.text;d.onclick=()=>{if(audio.src)audio.currentTime=l.time;};c.appendChild(d);lyricLineElements.push(d);});
}
function updateLyricSync() {
    if(!currentLyrics.length) return;
    const t=audio.currentTime; let ai=-1;
    for(let i=currentLyrics.length-1;i>=0;i--){if(t>=currentLyrics[i].time){ai=i;break;}}
    lyricLineElements.forEach((el,i)=>{el.classList.remove('active','past');if(i===ai)el.classList.add('active');else if(i<ai)el.classList.add('past');});
    if(ai>=0 && ai!==lastActiveLyricIndex && lyricLineElements[ai] && !lyricUserScrolling){
        lastActiveLyricIndex=ai;
        const c=document.getElementById('lyric-content');
        if(c){
            autoScrolling=true;
            const targetScroll=lyricLineElements[ai].offsetTop - c.clientHeight/3 + lyricLineElements[ai].clientHeight/2;
            c.scrollTo({top:Math.max(0,targetScroll),behavior:'smooth'});
            setTimeout(()=>{autoScrolling=false;},800);
        }
    }
}
async function loadLyricsForSong(song) {
    const info=document.getElementById('lyric-source-info'); if(info)info.textContent='';
    if(song.lyrics){renderLyrics(parseLRC(song.lyrics));if(info)info.textContent='已加载';}
    else if(song.source==='网易云'&&song.songId){
        renderLyrics([]);if(info)info.textContent='加载中...';
        const lrc=await fetchNeteaseLyric(song.songId);
        if(lrc){song.lyrics=lrc;renderLyrics(parseLRC(lrc));if(info)info.textContent='已加载';}else{if(info)info.textContent='获取失败';}
    } else { renderLyrics([]); }
}

// ================= API 搜索 =================
const CYAPI_KEY = '62ccfd8be755cc5850046044c6348d6cac5ef31bd5874c1352287facc06f94c4';
async function searchQQMusic(kw) {
    const url=`https://cyapi.top/API/qq_music.php?apikey=${CYAPI_KEY}&msg=${encodeURIComponent(kw)}&num=20&type=json&n=1`;
    printLog('发起 QQ音乐 搜索',url,false,'api');
    try{const r=await fetch(url);const d=await r.json();printLog('QQ音乐 响应成功',d,false,'api');
    let items=[];if(d.name&&d.url)items=[d];else if(d.data&&d.data.list)items=d.data.list;
    return items.map(i=>{let c=i.cover?(i.cover.large||i.cover.medium||i.cover.small):(i.picture||i.pic);
    return{name:i.name||'未知',artist:(i.artists&&i.artists[0])?i.artists[0].name:'QQ音乐',url:i.url||null,cover:c,duration:formatTime(i.duration||0),source:'QQ音乐',isVip:false,lyrics:(i.lyric&&i.lyric.text)?i.lyric.text:null};}).filter(s=>s.url);
    }catch(e){printLog('QQ音乐 请求报错',e.message||e,true,'api');return[];}
}
async function searchNetease(kw) {
    const url=`https://v2.alapi.cn/api/music/search?keyword=${encodeURIComponent(kw)}&limit=15&type=1&token=LwExDtUWhF3rH5ib`;
    printLog('发起 网易云音乐 搜索',url,false,'api');
    try{const r=await fetch(url);const j=await r.json();printLog('网易云 响应成功',j,false,'api');
    if(j&&j.data&&j.data.songs)return j.data.songs.map(s=>({name:s.name,artist:s.artists?.[0]?.name||'网易云',url:`https://music.163.com/song/media/outer/url?id=${s.id}.mp3`,cover:s.al?.picUrl||null,duration:formatTime(Math.floor((s.duration||0)/1000)),source:'网易云',isVip:false,songId:s.id}));
    return[];}catch(e){printLog('网易云 请求报错',e.message||e,true,'api');return[];}
}
async function searchNeteaseWithLyrics(kw) {
    const songs=await searchNetease(kw);
    if(songs.length>0)setTimeout(async()=>{for(const s of songs){if(s.songId&&!s.lyrics){try{const l=await fetchNeteaseLyric(s.songId);if(l)s.lyrics=l;}catch(e){}}}},500);
    return songs;
}
async function getRandomMusic() {
    printLog('发起 随机音乐 获取','random',false,'api');
    const proxyUrl='https://cros.xiongdaa.me/?url='+encodeURIComponent('https://api.52vmy.cn/api/music/wy/rand');
    const tasks=[]; for(let i=0;i<6;i++) tasks.push(fetch(proxyUrl).then(r=>r.json()).catch(()=>null));
    const results=await Promise.all(tasks);
    const songs=[];
    results.forEach(d=>{if(d&&d.code===200&&d.data&&d.data.Music)songs.push({name:d.data.song||'随机曲目',artist:d.data.singer||'随缘',url:d.data.Music,cover:d.data.cover||null,duration:'00:00',source:'随机',isVip:false});});
    if(songs.length)printLog('随机音乐',`成功获取 ${songs.length} 首随机歌曲`,false,'api');
    else printLog('随机音乐','全部请求失败',true,'api');
    return songs;
}

// ================= 搜索事件绑定 =================
function initSearchBindings() {
    const qqBtn=document.getElementById('searchQQBtn'), neBtn=document.getElementById('searchNeteaseBtn'), rndBtn=document.getElementById('randomMusicBtn'), kwInput=document.getElementById('musicKeyword');
    if(qqBtn) qqBtn.onclick=async()=>{const kw=kwInput.value.trim();if(!kw){showToast('请输入你想听的歌名');return;}musicListDiv.innerHTML='<div class="status-msg"><i class="fas fa-spinner fa-spin"></i> 正在 QQ 曲库中翻找...</div>';renderMusicList(await searchQQMusic(kw),'QQ音乐');};
    if(neBtn) neBtn.onclick=async()=>{const kw=kwInput.value.trim();if(!kw){showToast('请输入你想听的歌名');return;}musicListDiv.innerHTML='<div class="status-msg"><i class="fas fa-spinner fa-spin"></i> 正在网易云曲库中翻找...</div>';renderMusicList(await searchNeteaseWithLyrics(kw),'网易云');};
    if(rndBtn) rndBtn.onclick=async()=>{musicListDiv.innerHTML='<div class="status-msg"><i class="fas fa-spinner fa-spin"></i> 缘分天定，抽取灵韵...</div>';const s=await getRandomMusic();renderMusicList(s,'随缘曲库');if(s.length>0)playSongByIndex(0);};
    if(kwInput) kwInput.addEventListener('keypress',e=>{if(e.key==='Enter')qqBtn?.click();});
}

// ================= 天气系统 =================
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

// ================= 点击特效 =================
function createClickEffect(e) {
    const x=e.clientX, y=e.clientY;
    const ripple=document.createElement('div');ripple.className='click-effect';ripple.style.left=(x-50)+'px';ripple.style.top=(y-50)+'px';document.body.appendChild(ripple);setTimeout(()=>ripple.remove(),600);
    if(Math.random()>0.6){const h=document.createElement('div');h.className='click-heart';h.innerHTML='<i class="fas fa-heart"></i>';h.style.left=(x-10)+'px';h.style.top=(y-10)+'px';h.style.setProperty('--tx',(Math.random()-0.5)*40+'px');document.body.appendChild(h);setTimeout(()=>h.remove(),1200);}
    const pc=6+Math.floor(Math.random()*6);const colors=['#ffffff','#ffffff','#60a5fa','#34d399','#fbbf24'];
    for(let i=0;i<pc;i++){const p=document.createElement('div');p.className='click-particle';p.style.left=x+'px';p.style.top=y+'px';const a=(Math.PI*2/pc)*i+Math.random()*0.5,d=30+Math.random()*50;p.style.setProperty('--tx',Math.cos(a)*d+'px');p.style.setProperty('--ty',Math.sin(a)*d+'px');p.style.background=colors[Math.floor(Math.random()*colors.length)];document.body.appendChild(p);setTimeout(()=>p.remove(),800);}
}
document.addEventListener('click', createClickEffect);
document.addEventListener('touchstart', e=>{const t=e.touches[0];createClickEffect({clientX:t.clientX,clientY:t.clientY});},{passive:true});

// ================= 播放历史 =================
const HISTORY_KEY = 'xiongda_play_history';
let playHistory = [];
function loadPlayHistory() { try{const s=localStorage.getItem(HISTORY_KEY);if(s)playHistory=JSON.parse(s);}catch(e){playHistory=[];} renderHistoryPanel(); }
function addPlayHistory(song) {
    if(!song||!song.name)return;
    const ei=playHistory.findIndex(h=>h.name===song.name&&h.artist===song.artist);
    if(ei!==-1)playHistory.splice(ei,1);
    playHistory.unshift({name:song.name,artist:song.artist,source:song.source,timestamp:Date.now()});
    if(playHistory.length>50)playHistory=playHistory.slice(0,50);
    try{localStorage.setItem(HISTORY_KEY,JSON.stringify(playHistory));}catch(e){}
    renderHistoryPanel();
}
function renderHistoryPanel() {
    const c=document.getElementById('history-content'),cnt=document.getElementById('history-count');if(!c)return;
    if(cnt)cnt.textContent=`${playHistory.length} 首`;
    if(!playHistory.length){c.innerHTML='<div class="history-empty"><i class="fas fa-inbox"></i><br>暂无播放记录</div>';return;}
    c.innerHTML=playHistory.map((item,idx)=>{const ts=new Date(item.timestamp).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});return`<div class="history-item"><div class="history-info" onclick="playHistoryItem(${idx})"><div class="history-name">${escapeHtml(item.name)}</div><div class="history-artist">${escapeHtml(item.artist||'未知')} · ${item.source||'未知'}</div></div><div class="history-time">${ts}</div><div class="history-delete" onclick="deleteHistoryItem(${idx},event)"><i class="fas fa-trash"></i></div></div>`;}).join('');
}
function playHistoryItem(i){const item=playHistory[i];if(!item)return;const mi=currentPlaylist.findIndex(s=>s.name===item.name&&s.artist===item.artist);if(mi!==-1)playSongByIndex(mi);else showToast('该歌曲已不在播放列表中');}
function deleteHistoryItem(i,e){e.stopPropagation();playHistory.splice(i,1);try{localStorage.setItem(HISTORY_KEY,JSON.stringify(playHistory));}catch(ex){}renderHistoryPanel();}
function toggleHistoryPanel(){const p=document.getElementById('history-panel');if(!p)return;const isShow=p.classList.toggle('show');document.getElementById('lyric-panel')?.classList.remove('show');document.getElementById('bg-settings-panel')?.classList.remove('show');if(isShow)renderHistoryPanel();}


// ================= 夜间模式 =================
const NIGHT_MODE_KEY = 'xiongda_night_mode';
function initNightModeLocal() {
    try{const s=localStorage.getItem(NIGHT_MODE_KEY);if(s==='true'){document.documentElement.classList.add('night-mode');updateNightModeBtn(true);}else if(s==='false')updateNightModeBtn(false);}catch(e){}
}
function toggleNightMode() {
    const isNight=document.documentElement.classList.toggle('night-mode');
    updateNightModeBtn(isNight);
    try{localStorage.setItem(NIGHT_MODE_KEY,isNight.toString());}catch(e){}
}
function updateNightModeBtn(isNight) {
    const btn=document.getElementById('night-mode-btn');if(!btn)return;
    if(isNight){btn.classList.add('night-active');btn.innerHTML='<i class="fas fa-sun"></i>';btn.title='关闭夜间模式';}
    else{btn.classList.remove('night-active');btn.innerHTML='<i class="fas fa-moon"></i>';btn.title='开启夜间模式';}
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',e=>{try{if(localStorage.getItem(NIGHT_MODE_KEY)===null){if(e.matches)document.documentElement.classList.add('night-mode');else document.documentElement.classList.remove('night-mode');updateNightModeBtn(false);}}catch(e){}});

// ================= 背景系统 =================
const BG_KEY='xiongda_bg', BG_TYPE_KEY='xiongda_bg_type', BING_API='https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=zh-CN', DEFAULT_BG='https://img.8845.top/acg';
let currentVideoScale='cover';
function isVideoUrl(url){if(!url)return false;return['.mp4','.webm','.ogg','.mov'].some(e=>url.toLowerCase().endsWith(e));}
function initBgLocal(){
    try{const s=localStorage.getItem(BG_KEY),st=localStorage.getItem(BG_TYPE_KEY);
    const ss=localStorage.getItem('xiongda_video_scale');if(ss)currentVideoScale=ss;
    if(s){if(st==='video'||isVideoUrl(s)){setVideoBg(s);showVideoScaleSelector(true);}else{setImageBg(s);showVideoScaleSelector(false);}updateBgStatus(s===DEFAULT_BG?'默认':(st==='video'?'视频':'自定义'));}
    else{setImageBg(DEFAULT_BG);showVideoScaleSelector(false);updateBgStatus('默认');}}
    catch(e){setImageBg(DEFAULT_BG);showVideoScaleSelector(false);}
}
function showVideoScaleSelector(show){const s=document.getElementById('video-scale-selector');if(s)s.style.display=show?'block':'none';}
function setImageBg(url){const v=document.getElementById('bg-video');if(v){v.classList.remove('active');v.pause();v.src='';v.load();}showVideoScaleSelector(false);document.body.style.backgroundImage=`url('${url}')`;document.body.style.backgroundSize='cover';document.body.style.backgroundPosition='center';}
function setVideoBg(url){const v=document.getElementById('bg-video');if(!v)return;document.body.style.backgroundImage='none';v.classList.add('active');v.src=url;v.load();v.play().catch(e=>{printLog('视频背景播放失败',e.message,true,'system');});applyVideoScale();showVideoScaleSelector(true);}
function applyVideoScale(){const v=document.getElementById('bg-video');if(!v)return;if(currentVideoScale==='cover')v.removeAttribute('data-scale');else v.setAttribute('data-scale',currentVideoScale);document.querySelectorAll('.video-scale-btn').forEach(b=>b.classList.toggle('active',b.dataset.scale===currentVideoScale));}
function setVideoScale(s){currentVideoScale=s;applyVideoScale();try{localStorage.setItem('xiongda_video_scale',s);}catch(e){}}
function selectBg(name,url){if(name==='default'){resetBg();return;}if(url){if(isVideoUrl(url)){setVideoBg(url);try{localStorage.setItem(BG_KEY,url);localStorage.setItem(BG_TYPE_KEY,'video');}catch(e){}}else{setImageBg(url);try{localStorage.setItem(BG_KEY,url);localStorage.setItem(BG_TYPE_KEY,'image');}catch(e){}}updateBgStatus(name);document.querySelectorAll('.bg-option').forEach(o=>{o.classList.remove('active');if(o.dataset.bg===name)o.classList.add('active');});}}
function uploadBgMedia(input){const f=input.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{const d=e.target.result;const isV=f.type.startsWith('video/');if(isV)setVideoBg(d);else setImageBg(d);updateBgStatus('自定义');document.querySelectorAll('.bg-option').forEach(o=>o.classList.remove('active'));try{localStorage.setItem(BG_KEY,d);localStorage.setItem(BG_TYPE_KEY,isV?'video':'image');}catch(ex){showToast('文件太大，无法保存（仅本次有效）');}};r.readAsDataURL(f);}
function setBgByUrl(url){if(!url||!url.trim())return;url=url.trim();if(isVideoUrl(url)){setVideoBg(url);try{localStorage.setItem(BG_KEY,url);localStorage.setItem(BG_TYPE_KEY,'video');}catch(e){}}else{setImageBg(url);try{localStorage.setItem(BG_KEY,url);localStorage.setItem(BG_TYPE_KEY,'image');}catch(e){}}updateBgStatus('自定义链接');document.querySelectorAll('.bg-option').forEach(o=>o.classList.remove('active'));}
function resetBg(){setImageBg(DEFAULT_BG);updateBgStatus('默认');document.querySelectorAll('.bg-option').forEach(o=>{o.classList.remove('active');if(o.dataset.bg==='default')o.classList.add('active');});try{localStorage.setItem(BG_KEY,DEFAULT_BG);localStorage.setItem(BG_TYPE_KEY,'image');}catch(e){}showToast('已恢复默认背景');}
function updateBgStatus(n){const e=document.getElementById('bg-status');if(e)e.textContent=n;}
async function selectBingBg(event){if(event)event.stopPropagation();const msg=document.getElementById('bg-loading-msg');if(msg){msg.textContent='正在获取 Bing 风景...';msg.style.display='block';}try{const r=await fetch(`https://cros.xiongdaa.me/?url=${encodeURIComponent(BING_API)}`);const d=await r.json();if(d&&d.url){setImageBg(d.url);updateBgStatus('Bing 风景');try{localStorage.setItem(BG_KEY,d.url);localStorage.setItem(BG_TYPE_KEY,'image');}catch(e){}document.querySelectorAll('.bg-option').forEach(o=>o.classList.remove('active'));document.querySelector('.bg-option[data-bg="bing"]')?.classList.add('active');showToast('已切换为 Bing 风景');}else throw new Error('API 返回异常');}catch(e){showToast('获取失败: '+e.message);}finally{if(msg)msg.style.display='none';}}
function openBgSettings(){const p=document.getElementById('bg-settings-panel');if(!p)return;const isShow=p.classList.toggle('show');document.getElementById('lyric-panel')?.classList.remove('show');document.getElementById('history-panel')?.classList.remove('show');if(isShow){const s=localStorage.getItem(BG_KEY);document.querySelectorAll('.bg-option').forEach(o=>{o.classList.remove('active');if(o.dataset.bg==='default'&&(!s||s===DEFAULT_BG))o.classList.add('active');if(o.dataset.bg==='bing'&&s&&s!==DEFAULT_BG)o.classList.add('active');});try{const ss=localStorage.getItem('xiongda_video_scale');if(ss)currentVideoScale=ss;}catch(e){}applyVideoScale();}}


// ================= 作者生平弹窗 =================
let bioDataCache=null;
function openBioPanel(){const m=document.getElementById('bio-modal');if(!m)return;m.classList.add('show');document.body.style.overflow='hidden';if(bioDataCache){renderBioPanel(bioDataCache);return;}document.getElementById('bio-body').innerHTML='<div class="bio-loading"><i class="fas fa-spinner fa-spin"></i> 正在加载作者信息...</div>';fetch('sp.json').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).then(d=>{bioDataCache=d;renderBioPanel(d);printLog('作者生平','sp.json 加载成功',false,'system');}).catch(e=>{printLog('作者生平加载失败',e.message,true,'system');document.getElementById('bio-body').innerHTML='<div class="bio-error"><i class="fas fa-exclamation-triangle"></i><br>加载失败：'+escapeHtml(e.message)+'</div>';});}
function closeBioPanel(){document.getElementById('bio-modal')?.classList.remove('show');document.body.style.overflow='';}
function renderBioPanel(data){
    if(!data)return;const body=document.getElementById('bio-body');
    let skills='';if(data.skills?.length)skills=data.skills.map(s=>`<div class="bio-skill-item"><div class="bio-skill-icon"><i class="fas ${s.icon||'fa-code'}"></i></div><div class="bio-skill-name">${escapeHtml(s.name)}</div><div class="bio-skill-bar"><div class="bio-skill-fill" style="width:${s.level}%;"></div></div><div class="bio-skill-level">${s.level}%</div></div>`).join('');
    let timeline='';if(data.timeline?.length)timeline=data.timeline.map(t=>`<div class="bio-timeline-item"><div class="bio-timeline-year">${escapeHtml(t.year)}</div><div class="bio-timeline-event">${escapeHtml(t.event)}</div></div>`).join('');
    let projects='';if(data.projects?.length)projects=data.projects.map(p=>`<div class="bio-project"><a href="${escapeHtml(p.url)}" target="_blank"><i class="fas fa-external-link-alt" style="font-size:0.7rem;margin-right:6px;"></i>${escapeHtml(p.name)}</a><div class="bio-project-desc">${escapeHtml(p.desc)}</div><span class="bio-project-lang">${escapeHtml(p.lang)}</span></div>`).join('');
    let interests='';if(data.interests?.length)interests=data.interests.map(i=>`<span class="bio-tag">${escapeHtml(i)}</span>`).join('');
    let contact='';if(data.contact){const c=data.contact;if(c.website)contact+=`<a href="${escapeHtml(c.website)}" target="_blank"><i class="fas fa-globe"></i> 网站</a>`;if(c.email)contact+=`<a href="mailto:${escapeHtml(c.email)}"><i class="fas fa-envelope"></i> 邮件</a>`;if(c.qq)contact+=`<a href="javascript:void(0)" onclick="openApp('qq','${escapeHtml(c.qq)}')"><i class="fab fa-qq"></i> QQ</a>`;}
    body.innerHTML=`<div class="bio-avatar-section"><img class="bio-avatar" src="${escapeHtml(data.avatar||'https://q1.qlogo.cn/g?b=qq&nk=2700896261&s=640')}" onerror="this.src='https://q1.qlogo.cn/g?b=qq&nk=2700896261&s=640'"><div class="bio-name">${escapeHtml(data.name||'未知')}</div>${data.aka?'<div class="bio-aka">『'+escapeHtml(data.aka)+'』</div>':''}${data.occupation?'<div class="bio-occupation"><i class="fas fa-briefcase" style="margin-right:4px;"></i>'+escapeHtml(data.occupation)+'</div>':''}${data.motto?'<div class="bio-motto">'+escapeHtml(data.motto)+'</div>':''}</div>${data.bio?'<div class="bio-section"><div class="bio-section-title"><i class="fas fa-user"></i> 个人简介</div><div class="bio-bio-text">'+escapeHtml(data.bio)+'</div></div>':''}${data.quote?'<div class="bio-quote"><i class="fas fa-quote-left" style="margin-right:6px;opacity:0.5;"></i>'+escapeHtml(data.quote).replace(/——/g,'<br>——')+'</div>':''}${skills?`<div class="bio-section"><div class="bio-section-title"><i class="fas fa-cogs"></i> 技能栈</div><div class="bio-skills">${skills}</div></div>`:''}${timeline?`<div class="bio-section"><div class="bio-section-title"><i class="fas fa-history"></i> 时间线</div><div class="bio-timeline">${timeline}</div></div>`:''}${projects?`<div class="bio-section"><div class="bio-section-title"><i class="fas fa-folder-open"></i> 项目</div><div class="bio-projects">${projects}</div></div>`:''}${interests?`<div class="bio-section"><div class="bio-section-title"><i class="fas fa-heart"></i> 兴趣</div><div class="bio-tags">${interests}</div></div>`:''}${contact?`<div class="bio-section"><div class="bio-section-title"><i class="fas fa-address-book"></i> 联系方式</div><div class="bio-contact">${contact}</div></div>`:''}`;
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const m=document.getElementById('bio-modal');if(m?.classList.contains('show'))closeBioPanel();}});


// ================= 环境光效 Canvas =================
const THEME_COLORS = { aurora:{primary:"110,231,183",secondary:"96,165,250"} };
let ambientColors = THEME_COLORS.aurora;
function initAmbientCanvas(themeId) {
    ambientColors = THEME_COLORS[themeId] || THEME_COLORS.aurora;
    const cvs = document.createElement('canvas'); cvs.id='ambient-canvas';
    cvs.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.5;';
    cvs.width=window.innerWidth;cvs.height=window.innerHeight;
    document.body.insertBefore(cvs,document.body.firstChild);
    const ctx=cvs.getContext('2d');
    window.addEventListener('resize',()=>{cvs.width=window.innerWidth;cvs.height=window.innerHeight;});
    const particles=[];for(let i=0;i<30;i++)particles.push({x:Math.random()*cvs.width,y:Math.random()*cvs.height,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.2-0.1,size:Math.random()*3+1,opacity:Math.random()*0.4+0.1,pulse:Math.random()*Math.PI*2,type:Math.random()>0.5?'primary':'secondary'});
    function draw(){const w=cvs.width,h=cvs.height;ctx.clearRect(0,0,w,h);const t=Date.now()*0.0005;
    const cx1=w*0.3+Math.sin(t)*w*0.15,cy1=h*0.3+Math.cos(t*0.7)*h*0.1;
    const cx2=w*0.7+Math.cos(t*0.8)*w*0.12,cy2=h*0.7+Math.sin(t*0.6)*h*0.15;
    const g1=ctx.createRadialGradient(cx1,cy1,0,cx1,cy1,w*0.3);g1.addColorStop(0,`rgba(${ambientColors.primary},0.04)`);g1.addColorStop(1,'transparent');ctx.fillStyle=g1;ctx.fillRect(0,0,w,h);
    const g2=ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,w*0.25);g2.addColorStop(0,`rgba(${ambientColors.secondary},0.03)`);g2.addColorStop(1,'transparent');ctx.fillStyle=g2;ctx.fillRect(0,0,w,h);
    for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.pulse+=0.02;if(p.x<-10)p.x=w+10;if(p.x>w+10)p.x=-10;if(p.y<-10)p.y=h+10;if(p.y>h+10)p.y=-10;const op=p.opacity*(0.6+0.4*Math.sin(p.pulse));const clr=p.type==='primary'?ambientColors.primary:ambientColors.secondary;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fillStyle=`rgba(${clr},${op})`;ctx.fill();const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*4);glow.addColorStop(0,`rgba(${clr},${op*0.3})`);glow.addColorStop(1,'transparent');ctx.fillStyle=glow;ctx.fillRect(p.x-p.size*4,p.y-p.size*4,p.size*8,p.size*8);}
    requestAnimationFrame(draw);}draw();
}

// ================= 光标特效 =================
function initCursorEffects() {
    // 仅在非触屏设备启用
    if('ontouchstart' in window) return;
    const cursorEl=document.createElement('div');cursorEl.id='cursor-concentric';cursorEl.innerHTML='<div class="outer" style="width:36px;height:36px;"></div><div class="inner" style="width:18px;height:18px;"></div><div class="dot"></div>';document.body.appendChild(cursorEl);
    const cvs=document.createElement('canvas');cvs.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99998;';cvs.width=window.innerWidth;cvs.height=window.innerHeight;document.body.appendChild(cvs);const ctx=cvs.getContext('2d');window.addEventListener('resize',()=>{cvs.width=window.innerWidth;cvs.height=window.innerHeight;});
    const pts=[];const MAX=60,DUR=600;
    document.addEventListener('mousemove',e=>{cursorEl.style.left=e.clientX+'px';cursorEl.style.top=e.clientY+'px';cursorEl.classList.add('active');const last=pts[pts.length-1];if(!last||Math.abs(last.x-e.clientX)>2||Math.abs(last.y-e.clientY)>2){pts.push({x:e.clientX,y:e.clientY,time:Date.now()});if(pts.length>MAX)pts.shift();}});
    function draw(){ctx.clearRect(0,0,cvs.width,cvs.height);const now=Date.now();while(pts.length&&now-pts[0].time>DUR)pts.shift();if(pts.length<3){requestAnimationFrame(draw);return;}const hueOff=(now*0.05)%360;for(let i=1;i<pts.length;i++){const p0=pts[i-1],p1=pts[i],age=(now-p1.time)/DUR;const op=Math.max(0,1-age*1.2),lw=Math.max(0.3,6*(1-age*1.1));const hue=(hueOff+i*8)%360;ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.lineTo(p1.x,p1.y);ctx.strokeStyle=`hsla(${hue},80%,65%,${op})`;ctx.lineWidth=lw;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();if(op>0.3){ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.lineTo(p1.x,p1.y);ctx.strokeStyle=`hsla(${hue},90%,75%,${op*0.3})`;ctx.lineWidth=lw*2.5;ctx.stroke();}}requestAnimationFrame(draw);}draw();
    document.addEventListener('mousedown',()=>{cursorEl.classList.add('click');setTimeout(()=>cursorEl.classList.remove('click'),500);});
    document.addEventListener('mouseleave',()=>cursorEl.classList.remove('active'));
    document.addEventListener('mouseenter',()=>cursorEl.classList.add('active'));
    document.addEventListener('mouseover',e=>{const t=e.target.closest('a,button,.tool-item,.link-btn,.control-btn,.sidebar-link,.music-item,.bg-option,.quick-card,.func-card');if(t){cursorEl.style.transform='translate(-50%,-50%) scale(1.4)';cursorEl.querySelector('.outer').style.borderColor='#ffffff';cursorEl.querySelector('.inner').style.borderColor='rgba(255,255,255,0.7)';cursorEl.querySelector('.dot').style.background='#ffffff';}});
    document.addEventListener('mouseout',e=>{const t=e.target.closest('a,button,.tool-item,.link-btn,.control-btn,.sidebar-link,.music-item,.bg-option,.quick-card,.func-card');if(t){cursorEl.style.transform='translate(-50%,-50%) scale(1)';cursorEl.querySelector('.outer').style.borderColor='#ffffff';cursorEl.querySelector('.inner').style.borderColor='rgba(255,255,255,0.7)';cursorEl.querySelector('.dot').style.background='#ffffff';}});
}

function initViewTransitions(){
    if(!document.startViewTransition)return;
    document.addEventListener('click',e=>{const link=e.target.closest('a[href]');if(!link)return;const href=link.getAttribute('href');if(!href||href.startsWith('#')||href.startsWith('javascript:')||href.startsWith('mailto:')||href.startsWith('tel:'))return;if(link.target==='_blank')return;try{const url=new URL(href,location.origin);if(url.origin!==location.origin)return;}catch(err){return;}e.preventDefault();document.startViewTransition(()=>{window.location.href=href;});});
}

// ================= 歌词滚动监听 =================
function initLyricScroll() {
    const lc=document.getElementById('lyric-content');if(!lc)return;
    lc.addEventListener('scroll',()=>{if(autoScrolling)return;lyricUserScrolling=true;clearTimeout(lyricScrollTimer);lyricScrollTimer=setTimeout(()=>{lyricUserScrolling=false;},3000);});
}

// ================= 主页初始化入口 =================
function initIndexPage(themeId) {
    initNightModeLocal();
    initBgLocal();
    loadWeather();
    loadPlayHistory();
    initSearchBindings();
    initLyricScroll();
        initAmbientCanvas(themeId);
    initCursorEffects();
    initViewTransitions();
    // BG URL input enter
    const bgInput=document.getElementById('bg-url-input');
    if(bgInput)bgInput.addEventListener('keypress',e=>{if(e.key==='Enter'){setBgByUrl(bgInput.value);bgInput.value='';}});
}
