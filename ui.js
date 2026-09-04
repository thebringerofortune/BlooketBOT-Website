// UI and Event Handlers

async function spawnBots() {
    const gameId = document.getElementById('gameId').value;
    const botCount = parseInt(document.getElementById('botCount').value);
    const botNamePrefix = document.getElementById('botNamePrefix').value || 'Bot';
    const actionDelay = parseInt(document.getElementById('actionDelay').value);
    
    await botManager.spawnBots(gameId, botCount, botNamePrefix, actionDelay);
}

async function killAllBots() {
    const confirmed = confirm('Are you sure you want to kill all bots?');
    if (confirmed) {
        await botManager.killAllBots();
    }
}

async function sendChatMessage() {
    const message = document.getElementById('chatMessage').value;
    
    if (!message.trim()) {
        alert('Please enter a message');
        return;
    }
    
    await botManager.sendMessageToAll(message);
}

async function spamChat() {
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
    
    log(`🔊 Starting spam: ${spamCount} messages`, 'info');
    
    for (let i = 0; i < spamCount; i++) {
        await botManager.sendMessageToAll(`[${i + 1}/${spamCount}] ${message}`);
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    log('✅ Spam complete', 'success');
}

async function sendAnswer() {
    const answer = document.getElementById('answerText').value;
    
    if (!answer.trim()) {
        alert('Please enter an answer');
        return;
    }
    
    await botManager.sendAnswerToAll(answer);
}

async function randomAnswer() {
    const answers = ['A', 'B', 'C', 'D'];
    const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
    
    log(`🎲 Random answer selected: ${randomAnswer}`, 'info');
    await botManager.sendAnswerToAll(randomAnswer);
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
        alert('Text copied to message field!');
    }
}

function updateUI() {
    // Update bot list
    const botListEl = document.getElementById('botList');
    
    if (botManager.bots.length === 0) {
        botListEl.innerHTML = '<div style="color: #999; text-align: center; padding: 20px;">No bots spawned yet</div>';
    } else {
        botListEl.innerHTML = botManager.bots
            .map((bot, index) => {
                let statusClass = 'status-disconnected';
                if (bot.status === 'connected') statusClass = 'status-connected';
                if (bot.status === 'connecting') statusClass = 'status-connecting';
                
                let botClass = 'bot-item';
                if (bot.status === 'connected') botClass += ' active';
                if (bot.status === 'disconnected') botClass += ' error';
                
                return `
                    <div class="${botClass}">
                        <strong>Bot #${index + 1}: ${bot.botName}</strong>
                        <span class="bot-status ${statusClass}">${bot.status.toUpperCase()}</span>
                    </div>
                `;
            })
            .join('');
    }
    
    // Update statistics
    const stats = botManager.getStats();
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statActive').textContent = stats.active;
    document.getElementById('statConnecting').textContent = stats.connecting;
    document.getElementById('statFailed').textContent = stats.failed;
}

// Initial UI render
updateUI();

// Log initial message
log('🎮 Blooket Bot Manager loaded. Ready to spawn bots!', 'info');
