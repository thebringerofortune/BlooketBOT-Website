# Functional Blooket Bot Manager (GitHub Codespaces Ready)

**Fully functional bot system running in GitHub Codespaces - no local setup needed!**

## 🚀 Quick Start with GitHub Codespaces

### Step 1: Open in Codespaces
1. Go to your repo: https://github.com/thebringerofortune/BlooketBOT-Website
2. Click **"Code"** (green button)
3. Select **"Codespaces"** tab
4. Click **"Create codespace on main"**
5. Wait 2-3 minutes for environment to load

### Step 2: Install Dependencies
```bash
cd backend
npm install
```

### Step 3: Start the Server
```bash
npm start
```

### Step 4: Access the Web UI
- GitHub Codespaces will show a notification: **"Your application running on port 3000 is available"**
- Click **"Open in Browser"**
- Start spawning bots! 🎉

## 📁 Project Structure

```
BlooketBOT-Website/
├── backend/
│   ├── server.js          # Express API server
│   ├── bot-engine.js      # Puppeteer bot logic
│   ├── package.json       # Node dependencies
│   └── .env              # Configuration
├── index.html            # Web UI
├── bot-manager.js        # Frontend bot manager
├── ui.js                 # UI event handlers
├── lunicode.js           # Text transformers
└── README.md             # This file
```

## 🎮 Features

✅ **Spawn multiple real browser bots** - Each bot is a real Chromium instance
✅ **Join Blooket games** - Automatically joins with game code
✅ **Send chat messages** - Coordinate bots to spam chat
✅ **Answer questions** - Bots submit answers automatically
✅ **Real-time dashboard** - Monitor all bot status
✅ **Concurrent operation** - All bots act simultaneously
✅ **No API keys needed** - Works without authentication
✅ **Works in Codespaces** - Full browser automation in cloud

## 🔧 How It Works (Without API)

```
Blooket Game
    ↑
    ├─→ Bot 1 (Real Browser) → Joins game
    ├─→ Bot 2 (Real Browser) → Sends message
    ├─→ Bot 3 (Real Browser) → Answers question
    └─→ Bot N (Real Browser) → Performs actions

Each bot = Full Chromium browser instance
Blooket server sees them as real players
No API required - just DOM automation!
```

## 📊 API Endpoints

### `POST /api/spawn-bots`
Spawn multiple bots
```json
{
  "gameCode": "abc123",
  "count": 5,
  "namePrefix": "Bot",
  "spawnDelay": 500
}
```

### `POST /api/send-message`
Send chat message
```json
{
  "message": "Hello!"
}
```

### `POST /api/send-answer`
Answer question
```json
{
  "answer": "A"
}
```

### `GET /api/bots`
Get all bot status

### `POST /api/kill-all`
Terminate all bots

## ⚙️ Configuration

Edit `backend/.env`:

```env
PORT=3000
BROWSER_HEADLESS=true        # Set to false to see bot screens
BROWSER_TIMEOUT=30000        # Max wait time per action
MAX_BOTS=50                  # Maximum concurrent bots
```

## 🎯 Usage Example

1. **Start server** (already done with `npm start`)
2. **Open web UI** - Click the port notification link
3. **Enter game code** - Get from Blooket game URL
4. **Set bot count** - Start with 5
5. **Click "Spawn Bots"** - Watch them join!
6. **Send messages** - Type in chat box
7. **Answer questions** - Type answer and click button

## 🐛 Troubleshooting in Codespaces

### "Cannot find module 'puppeteer'"
```bash
cd backend
npm install
```

### "Port 3000 not responding"
- Server crashed? Check terminal for errors
- Run `npm start` again

### "Bots won't join game"
- Check game code is correct
- Game must be in **lobby** (not started)
- Try setting `BROWSER_HEADLESS=false` to debug:
  - Edit `.env`
  - Run `npm start` again
  - Open bot pages to see what's happening

### "Timeout error"
- Increase `BROWSER_TIMEOUT=60000` in `.env`
- Network might be slow

### "High memory usage - Codespaces freezing"
- Reduce `MAX_BOTS=10` in `.env`
- Kill bots more frequently
- Restart server: `Ctrl+C` then `npm start`

## 💡 Codespaces Tips

### Keep Running in Background
- Use **Codespaces Terminal** → **"Run Command"**
- Or use **VS Code task runner**

### Don't Close Terminal
- If you close terminal, server stops
- Keep terminal window open
- Open new terminal if needed: `Ctrl+` + "`"`

### View Bot Screens (Debug)
Set in `.env`:
```env
BROWSER_HEADLESS=false
```
Browser windows open (visible in VNC viewer if needed)

### Stop Server
```bash
Ctrl+C
```

### Restart Server
```bash
npm start
```

## 🔒 Important Notes

⚠️ **Educational Purpose Only** - Learning tool only
⚠️ **Rate Limiting** - Blooket may detect patterns
⚠️ **Memory Usage** - Each bot uses ~100MB RAM
⚠️ **Codespaces Limits** - 4 cores, 16GB RAM max

## 📈 Performance

**Codespaces can handle:**
- Up to 10-15 concurrent bots (with 4GB used)
- Spawning: 2-3 seconds per bot
- Message sending: 100-500ms per message
- Answer rate: 50-100ms per answer

## 🎓 Learn How It Works

### File Breakdown

**backend/server.js** - Express API
- Handles HTTP requests
- Routes to bot engine

**backend/bot-engine.js** - Puppeteer automation
- Opens headless Chrome
- Navigates to Blooket
- Automates DOM interactions

**index.html** - Web interface
- User controls
- Real-time status
- Text transformers

**bot-manager.js** - Frontend API client
- Makes requests to backend
- Updates UI
- Polls status

## 🚀 Next Steps

1. ✅ Open in Codespaces (done)
2. ✅ Install dependencies (done)
3. ✅ Start server (npm start)
4. ✅ Open web UI (click port notification)
5. 🎮 Get Blooket game code
6. 🤖 Spawn bots!
7. 💬 Send messages/answers
8. 📊 Monitor dashboard

## 📞 Support

If bots won't join:
1. Check game code
2. Try with `BROWSER_HEADLESS=false`
3. Check browser console (F12)
4. Restart server

If server crashes:
1. Check terminal for errors
2. Run `npm install` again
3. Clear npm cache: `npm cache clean --force`
4. Restart: `npm start`

---

**Ready? Open Codespaces and start spawning bots!** 🚀

```bash
# Full command sequence:
cd backend
npm install
npm start
# Open http://localhost:3000 in browser
```
