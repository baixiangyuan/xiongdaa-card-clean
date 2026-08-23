# 🌐 xiongdaa Personal Card

> A beautiful glassmorphism-style personal homepage featuring a music player, real-time clock, hitokoto display, synchronized lyrics, and more.

## 📸 Page Screenshots

### Main Interface
![Main Interface Screenshot](./2ad87f928b21eb6fec08319b9aa99854.png)

### Lyrics Panel
![Lyrics Panel Screenshot](./8db5affe3e23581b82d0853472f0c5e1.png)

## ✨ Features

- **Glassmorphism Design** — Modern Glassmorphism style with frosted glass effects and dynamic backgrounds
- **Music Player** — Supports QQ Music and NetEase Cloud Music search & playback, vinyl record animation, synchronized lyrics display
- **Real-time Clock** — Precise time display down to the second, with date information
- **Hitokoto Display** — Random hitokoto (one-sentence quotes) with typewriter effect
- **🆕 Custom Background** — Supports image/video backgrounds; freely upload local image or video files as page backgrounds
- **🆕 Bing Wallpaper** — Integrated Bing Daily Wallpaper API for one-click high-quality fullscreen wallpapers
- **🆕 History** — Automatically records playback history; quickly review on next page load
- **🆕 Persistent Wallpaper Data** — Wallpaper preferences automatically saved to localStorage; persists after page refresh
- **🆕 Default Wallpaper API Updated** — Default wallpaper source has been switched for more stable loading and clearer image quality
- **API Logs** — Built-in terminal log panel for real-time API response monitoring
- **Responsive Layout** — Perfectly adapted for desktop and mobile devices
- **Meta Tag Optimization** — Complete meta tags, sitemap, and robots.txt configuration

## 🚀 Quick Start

### 🌐 Live Preview

- **GitHub Pages**: https://baixiangyuan.github.io/xiongdaa-card/

> 💡 The page will automatically redeploy approximately 1–2 minutes after each `push` or `PR` to the `main` branch.

### Local Run

```bash
# Simply open index.html in your browser
open index.html
```

### Deploy to GitHub Pages (Auto-Deploy Configured)

This project is configured with GitHub Actions auto-deployment:

```bash
# Just push to the main branch to trigger auto-deployment
git push origin main
```

- **Trigger**: Every `push` or `PR` to the `main` branch
- **Deploy URL**: https://baixiangyuan.github.io/xiongdaa-card/
- **Take Effect**: Approximately 1–2 minutes

### Deploy to Other Platforms

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the entire folder into Netlify Drop
- **Cloudflare Pages**: `wrangler pages deploy .`

## 📁 Project Structure

```
xiongdaa-card/
├── index.html          # Main page (glassmorphism personal homepage)
├── head-meta.html      # Meta tag module
├── 404.html            # 404 page (public welfare redirect)
├── robots.txt          # Search engine crawler configuration
├── sitemap.xml         # Site map
├── README.md           # Project description
└── LICENSE             # MIT open-source license
```

## 🔧 Custom Configuration

### Edit Personal Information

> ⚠️ **Important**: All personal information in this project has been replaced with placeholders. Please be sure to replace them with your own information before deploying!

Edit `index.html` and find the following locations to modify:

| Location | Content | Placeholder | Replace With |
|------|------|--------|--------|
| Line ~319 | Name | `bxy` | Your nickname |
| Line ~326 | GitHub Link | `https://github.com/baixiangyuan` | Your repository |
| Line ~331 | QQ Number | `Your QQ Number` | Your QQ |
| Line ~336 | WeChat ID | `Your QQ Number` | Your WeChat |
| Line ~341 | Email | `Your Email` | Your email |
| Line ~70 | Avatar Image | `https://q1.qlogo.cn/g?b=qq&nk=YourQQNumber&s=640` | Your avatar URL |
| Line ~947 | Music Cover | `https://q1.qlogo.cn/g?b=qq&nk=YourQQNumber&s=640` | Your cover URL |
| Line ~2448 | Bio Avatar | `https://q1.qlogo.cn/g?b=qq&nk=YourQQNumber&s=640` | Your avatar URL |

### Edit Bio Data API

The bio data JSON API has been replaced with a placeholder; please replace it with a usable API:

```javascript
// Find the following location in the <script> section of bio.html
const BIO_API = 'https://cros.xiongdaa.me/?url=' + encodeURIComponent('Your bio data API');
```

#### 📋 Bio Data JSON Configuration Documentation

The page expects the bio data JSON API to return data in the following format:

```json
{
  "name": "Name",
  "aka": "Alias",
  "occupation": "Occupation",
  "motto": "Motto",
  "avatar": "Avatar URL",
  "location": "Location",
  "birthday": "Birthday",
  "bio": "Personal Bio",
  "quote": "Quote",
  "skills": [
    {
      "name": "Skill Name",
      "icon": "fa-code",
      "level": 85
    }
  ],
  "timeline": [
    {
      "year": "2020",
      "event": "Event Description"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "url": "https://github.com/xxx",
      "desc": "Project Description",
      "lang": "C++"
    }
  ],
  "interests": ["Interest 1", "Interest 2"],
  "contact": {
    "github": "https://github.com/xxx",
    "website": "https://example.com",
    "email": "email@example.com",
    "qq": "123456789",
    "wechat": "your_wechat"
  }
}
```

#### 🔍 Field Descriptions

| Field | Type | Required | Description |
|------|------|------|------|
| `name` | String | ✅ | Name |
| `aka` | String | ❌ | Alias/Nickname |
| `occupation` | String | ❌ | Occupation/Identity |
| `motto` | String | ❌ | Motto |
| `avatar` | String | ✅ | Avatar URL |
| `location` | String | ❌ | Location |
| `birthday` | String | ❌ | Birthday |
| `bio` | String | ✅ | Personal Bio (supports HTML) |
| `quote` | String | ❌ | Quote (displayed as a blockquote) |
| `skills` | Array | ❌ | Skills array |
| `skills[].name` | String | ✅ | Skill name |
| `skills[].icon` | String | ❌ | Font Awesome icon class (default `fa-code`) |
| `skills[].level` | Number | ✅ | Proficiency percentage (0-100) |
| `timeline` | Array | ❌ | Timeline array |
| `timeline[].year` | String | ✅ | Year |
| `timeline[].event` | String | ✅ | Event description |
| `projects` | Array | ❌ | Projects array |
| `projects[].name` | String | ✅ | Project name |
| `projects[].url` | String | ✅ | Project link |
| `projects[].desc` | String | ❌ | Project description |
| `projects[].lang` | String | ❌ | Primary language/tag |
| `interests` | Array | ❌ | Interest tags array |
| `contact` | Object | ❌ | Contact information |
| `contact.github` | String | ❌ | GitHub link |
| `contact.website` | String | ❌ | Personal website |
| `contact.email` | String | ❌ | Email |
| `contact.qq` | String | ❌ | QQ number |
| `contact.wechat` | String | ❌ | WeChat ID |

#### 📝 Complete Example

```json
{
  "name": "bxy",
  "aka": "Embedded Developer",
  "occupation": "ESP32 Embedded Development",
  "motto": "Code Changes the World",
  "avatar": "https://q1.qlogo.cn/g?b=qq&nk=YourQQNumber&s=640",
  "location": "China",
  "birthday": "2000-01-01",
  "bio": "Passionate about embedded development, focusing on ESP32 series chips. Loves frontend technology and pursues the ultimate user experience.",
  "quote": "Stay curious, always learn new things.",
  "skills": [
    { "name": "C/C++", "icon": "fa-code", "level": 90 },
    { "name": "Python", "icon": "fa-python", "level": 75 },
    { "name": "ESP32", "icon": "fa-microchip", "level": 85 },
    { "name": "Frontend", "icon": "fa-html5", "level": 70 }
  ],
  "timeline": [
    { "year": "2020", "event": "Started learning embedded development" },
    { "year": "2023", "event": "Created ESP32-S3 project" },
    { "year": "2026", "event": "Released personal homepage xiongdaa-card" }
  ],
  "projects": [
    {
      "name": "ESP32-S3 Cyber OS",
      "url": "https://github.com/baixiangyuan/esp32s3-cyber-os",
      "desc": "NES emulator based on ESP32-S3",
      "lang": "C++"
    },
    {
      "name": "xiongdaa-card",
      "url": "https://github.com/baixiangyuan/xiongdaa-card",
      "desc": "Glassmorphism-style personal homepage",
      "lang": "HTML/CSS/JS"
    }
  ],
  "interests": ["Embedded", "Frontend", "Game Development", "AI"],
  "contact": {
    "github": "https://github.com/baixiangyuan",
    "website": "https://xiongdaa.me",
    "email": "your.email@example.com",
    "qq": "YourQQNumber",
    "wechat": "YourWeChatID"
  }
}
```

#### ⚠️ Notes

1. **CORS**: Ensure the API supports CORS and allows access from the GitHub Pages domain
2. **HTTPS**: GitHub Pages uses HTTPS; the API must also be HTTPS
3. **Proxy Server**: If the API does not support CORS, you can use a proxy server (such as the `cros.xiongdaa.me` in bio.html)
4. **Error Handling**: The page will display an error message if the API fails; please ensure the API is stable and available

**Recommended Usage:**
- Self-host JSON files on GitHub/Gitee
- Use third-party JSON storage services (such as JSONBin, LowDB)
- Solve cross-domain issues via a proxy server

### Edit Music API

Music search API configuration is in the `<script>` section of `index.html`:

```javascript
// QQ Music API
const url = `https://cyapi.top/API/qq_music.php?apikey=${CYAPI_KEY}...`;

// NetEase Cloud Music API
const url = `https://v2.alapi.cn/api/music/search?keyword=...`;
```

Please replace with a usable API key.

### 🆕 Custom Background (Image/Video)

The page supports setting custom backgrounds. You can upload local image or video files in the settings panel:

- **Image Background**: Supports JPG/PNG/WebP and other common image formats
- **Video Background**: Supports MP4/WebM and other video formats; automatically loops playback
- **Persistent Save**: Background settings are automatically saved to browser localStorage and automatically restored after page refresh

### 🆕 Bing Wallpaper

The page has integrated Bing Daily Wallpaper. Click the wallpaper switch button to get the latest Bing HD wallpaper:

- Uses `bing.biturl.top` API to get full-size original images (not cached thumbnails)
- Automatically adapts to desktop/mobile resolution
- Wallpaper preference (whether to enable Bing wallpaper) is persistently saved

### 🆕 History

Music playback history is automatically recorded:

- Every time a song is played, it is automatically added to the history list
- History is saved in localStorage and is not lost after closing the page
- Can be quickly reviewed and replayed in the player panel

### 🆕 Default Wallpaper API Updated

The default wallpaper source has been updated to a more stable interface:

- New default wallpaper API: `https://img.8845.top/acg`
- Less request delay, higher success rate
- To change the wallpaper source, modify the `DEFAULT_BG_API` configuration in the `<script>` section of `index.html`

## 📄 Open Source License

This project is open-sourced under the **MIT License**.

See the [LICENSE](./LICENSE) file for details.

**Please retain the author attribution when using**, which is included in the repository link at the bottom of the HTML page.

---

## ⚠️ Important Notice / Disclaimer

### 🎵 Music API Usage Notice

> **Please be sure to read the following carefully. Using this project means you understand and accept the following terms.**

1. **Unofficial APIs**
   The QQ Music, NetEase Cloud Music, and other music search and playback interfaces used in this project are **third-party unofficial APIs**, not officially provided by QQ Music, NetEase Cloud Music, etc. The author of this project has no affiliation with these API providers.

2. **For Learning and Research Only**
   This project is **for personal learning and technical research only**. It is strictly prohibited for any commercial use, profit-making purposes, or large-scale distribution. Please do not use this project in any scenario that infringes on music copyrights.

3. **No API Stability Guarantee**
   Third-party APIs may **change, stop service, or add verification mechanisms** at any time, causing music search or playback functions to fail. The author of this project **does not guarantee the availability, stability, or response speed of the APIs**, and assumes no responsibility for any losses or liabilities caused by API changes.

4. **Copyright Risks Borne by User**
   Music played through this project may involve **copyright risks**. The copyright of music works belongs to the original copyright holders. Unauthorized dissemination or playback may constitute infringement. **Users are responsible for any legal risks arising from this**. The author of this project assumes no responsibility for this.

5. **API Key Security**
   The API Key included in the project is for learning reference only. **Please do not leak, share, or use it in commercial projects**. If the API provider finds the API Key is being abused, they may ban the key, causing the function to become unavailable.

6. **Music Link Validity**
   Audio direct links usually have **time limits** and may expire at any time. If a song cannot be played, it is normal; please try changing the search term or wait for the API to update.

### 📋 Usage Suggestions

| Scenario | Suggestion |
|------|------|
| Personal Learning/Testing | ✅ Can be used, please comply with the above terms |
| Personal Blog/Homepage | ✅ Can be used, it is recommended to replace with your own API Key |
| Commercial Projects | ❌ **Strictly Prohibited** |
| Redistribution/Packaging for Sale | ❌ **Strictly Prohibited** |
| Large-scale Public Deployment | ❌ Not recommended, APIs may be rate-limited or banned |

### 🔒 Privacy and Security

- This project **does not collect or upload any user data**
- All API requests are sent directly from the user's browser, **not through the author's server**
- Please do not fill in your **real contact information** in the project; examples have all been replaced with placeholders
- Before deploying, please check and replace all sensitive information (API Key, email, QQ, WeChat, etc.)

### 📞 About API Issues

If you encounter API failure, response errors, or music playback issues:

- ❌ The author of this project **cannot fix third-party API issues**
- ✅ You can try: changing the API source, finding an alternative API, or waiting for the API provider to fix it
- ✅ Feedback is welcome in GitHub Issues, but the author **does not guarantee a fix**

---

> **Summary: This is a learning project; the music function is for demonstration only. Please respect music copyrights, do not use commercially, and don't blame me if the API goes down~**

## 🙏 Acknowledgments

- [Font Awesome](https://fontawesome.com/) - Icon library
- [Noto Sans SC](https://fonts.google.com/) - Chinese font
- [Hitokoto](https://hitokoto.cn/) - Hitokoto API
- All open-source community contributors

## 📝 Changelog

### 2026-06-20 — Sensitive Information Replacement
- ✅ QQ number replaced with placeholder (including QQ number parameter in avatar URL)
- ✅ WeChat ID replaced with placeholder
- ✅ Email replaced with placeholder
- ✅ Blog API replaced with placeholder
- ✅ All personal information has been removed; please replace before deploying

### 2026-06-19 — Feature Enhancements
- 🆕 Custom Background (Image/Video)
- 🆕 Bing Daily Wallpaper
- 🆕 Playback History
- 🆕 Default Wallpaper API Updated
- 🆕 API Log Terminal Panel

---

## 📮 Contact

- GitHub: [@baixiangyuan](https://github.com/baixiangyuan)
- Repository: [xiongdaa-card](https://github.com/baixiangyuan/xiongdaa-card)

---

> ⭐ If you find this useful, please give it a Star!

<!-- Updated at 2026-06-20 -->
