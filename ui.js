// ui.js - Updated for backend integration

const API_URL = window.location.origin; // Use same origin for API

class RemoteBotManager {
    constructor() {
        this.botIds = [];
        this.isSpawning = false;
    }

    async spawnBots() {
        const gameId = document.getElementById('gameId').value;
        const botCount = parseInt(document.getElementById('botCount').value);
        const botNamePrefix = document.getElementById('botNamePrefix').value || 'Bot';
        const actionDelay = parseInt(document.getElementById('actionDelay').value);
        
        if (!gameId.trim()) {
            alert('Please enter a game code');
            return;
        }

        if (this.isSpawning) {
            alert('Already spawning bots');
            return;
        }

        this.isSpawning = true;

        try {
            log(`🤖 Spawning ${botCount} bots for game ${gameId}...`, 'info');
            
            const response = await fetch(`${API_URL}/api/spawn-bots`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameCode: gameId.trim().toLowerCase(),
                    count: botCount,
                    namePrefix: botNamePrefix,
                    spawnDelay: actionDelay
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.botIds = data.botIds || [];
                log(`✅ ${data.message}`, 'success');
            } else {
                log(`❌ Error: ${data.error}`, 'error');
            }
        } catch (error) {
            log(`❌ Network error: ${error.message}`, 'error');
        } finally {
            this.isSpawning = false;
            updateUI();
        }
    }

    async sendMessageToAll() {
        const message = document.getElementById('chatMessage').value;
        
        if (!message.trim()) {
            alert('Please enter a message');
            return;
        }

        if (this.botIds.length === 0) {
            log('❌ No bots spawned', 'error');
            return;
        }

        try {
            log(`📨 Sending message to ${this.botIds.length} bots...`, 'info');
            
            const response = await fetch(`${API_URL}/api/send-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            if (response.ok) {
                log(`✅ ${data.results.success}/${data.results.total} bots sent message`, 'success');
            } else {
                log(`❌ Error: ${data.error}`, 'error');
            }
        } catch (error) {
            log(`❌ Network error: ${error.message}`, 'error');
        }
    }

    async sendAnswerToAll() {
        const answer = document.getElementById('answerText').value;
        
        if (!answer.trim()) {
            alert('Please enter an answer');
            return;
        }

        if (this.botIds.length === 0) {
            log('❌ No bots spawned', 'error');
            return;
        }

        try {
            log(`🎯 Sending answer to ${this.botIds.length} bots...`, 'info');
            
            const response = await fetch(`${API_URL}/api/send-answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer })
            });

            const data = await response.json();

            if (response.ok) {
                log(`✅ ${data.results.success}/${data.results.total} bots answered`, 'success');
            } else {
                log(`❌ Error: ${data.error}`, 'error');
            }
        } catch (error) {
            log(`❌ Network error: ${error.message}`, 'error');
        }
    }

    async killAllBots() {
        if (this.botIds.length === 0) {
            log('No bots to kill', 'info');
            return;
        }

        const confirmed = confirm(`Kill all ${this.botIds.length} bots?`);
        if (!confirmed) return;

        try {
            log(`🔪 Killing all bots...`, 'info');
            
            const response = await fetch(`${API_URL}/api/kill-all`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok) {
                this.botIds = [];
                log(`✅ All bots terminated`, 'success');
            } else {
                log(`❌ Error: ${data.error}`, 'error');
            }
        } catch (error) {
            log(`❌ Network error: ${error.message}`, 'error');
        }
        
        updateUI();
    }

    async getStatus() {
        try {
            const response = await fetch(`${API_URL}/api/bots`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching status:', error);
            return null;
        }
    }
}

const botManager = new RemoteBotManager();

// Event handlers
function spawnBots() {
    botManager.spawnBots();
}

function killAllBots() {
    botManager.killAllBots();
}

function sendChatMessage() {
    botManager.sendMessageToAll();
}

function spamChat() {
    const message = document.getElementById('chatMessage').value;
    if (!message.trim()) {
        alert('Please enter a message to spam');
        return;
    }
    
    const count = prompt('How many times to spam? (1-50)', '5');
    if (!count) return;
    
    const spamCount = parseInt(count);
    if (isNaN(spamCount) || spamCount < 1 || spamCount > 50) {
        alert('Please enter a valid number between 1 and 50');
        return;
    }
    
    botManager.sendMessageToAll(); // First message
    
    for (let i = 1; i < spamCount; i++) {
        setTimeout(() => botManager.sendMessageToAll(), i * 300);
    }
}

function sendAnswer() {
    botManager.sendAnswerToAll();
}

function randomAnswer() {
    const answers = ['A', 'B', 'C', 'D'];
    const randomAns = answers[Math.floor(Math.random() * answers.length)];
    document.getElementById('answerText').value = randomAns;
    log(`🎲 Random answer selected: ${randomAns}`, 'info');
    botManager.sendAnswerToAll();
}

function transformText(tool) {
    const input = document.getElementById('transformInput').value;
    const output = document.getElementById('output');
    
    if (!input.trim()) {
        alert('Please enter text to transform');
        return;
    }
    
    let result = input;
    const lunicode = new Lunicode();
    
    try {
        switch(tool) {
            case 'flip':
                result = lunicode.tools.flip.encode(input);
                break;
            case 'mirror':
                result = lunicode.tools.mirror.encode(input);
                break;
            case 'creepify':
                result = lunicode.tools.creepify.encode(input);
                break;
            case 'tiny':
                result = lunicode.tools.tiny.encode(input);
                break;
        }
        
        output.textContent = result;
        output.style.display = 'block';
        log(`✨ Transformed text using ${tool}`, 'success');
    } catch(e) {
        alert('Error transforming text: ' + e.message);
        log('❌ Text transformation failed: ' + e.message, 'error');
    }
}

function copyToMessage() {
    const output = document.getElementById('output');
    const text = output.textContent;
    
    if (text) {
        document.getElementById('chatMessage').value = text;
        alert('✅ Text copied to message field!');
    }
}

const consoleLogs = [];
const MAX_LOGS = 100;

function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { message, type, timestamp };
    consoleLogs.push(logEntry);
    
    if (consoleLogs.length > MAX_LOGS) {
        consoleLogs.shift();
    }
    
    renderConsole();
    console.log(`[${type.toUpperCase()}] ${message}`);
}

function renderConsole() {
    const consoleEl = document.getElementById('console');
    consoleEl.innerHTML = consoleLogs
        .map(entry => {
            let className = 'output-info';
            if (entry.type === 'success') className = 'output-success';
            if (entry.type === 'error') className = 'output-error';
            
            return `<div class="output-line ${className}">[${entry.timestamp}] ${entry.message}</div>`;
        })
        .join('');
    
    consoleEl.scrollTop = consoleEl.scrollHeight;
}

function clearConsole() {
    consoleLogs.length = 0;
    renderConsole();
}

// Poll for status updates
setInterval(async () => {
    const status = await botManager.getStatus();
    if (status) {
        updateBotDisplay(status);
    }
}, 2000);

function updateBotDisplay(status) {
    document.getElementById('statTotal').textContent = status.total;
    document.getElementById('statActive').textContent = status.connected;
    document.getElementById('statConnecting').textContent = status.connecting;
    document.getElementById('statFailed').textContent = status.failed;

    const botListEl = document.getElementById('botList');
    
    if (status.bots.length === 0) {
        botListEl.innerHTML = '<div style="color: #999; text-align: center; padding: 20px;">No bots spawned yet</div>';
    } else {
        botListEl.innerHTML = status.bots
            .map((bot, index) => {
                let statusClass = 'status-disconnected';
                if (bot.status === 'connected') statusClass = 'status-connected';
                if (bot.status === 'connecting') statusClass = 'status-connecting';
                
                let botClass = 'bot-item';
                if (bot.status === 'connected') botClass += ' active';
                if (bot.status === 'failed') botClass += ' error';
                
                return `
                    <div class="${botClass}">
                        <strong>${bot.username}</strong>
                        <span class="bot-status ${statusClass}">${bot.status.toUpperCase()}</span>
                        ${bot.error ? `<small style="color: #f85032;"> - ${bot.error}</small>` : ''}
                    </div>
                `;
            })
            .join('');
    }
}

function updateUI() {
    // UI already updates via polling
}

// Initial setup
log('🚀 Blooket Bot Manager loaded and ready!', 'success');
log('📝 Enter game code and click "Spawn Bots" to start', 'info');
