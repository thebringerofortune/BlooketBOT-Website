// Blooket Bot Manager
class BlooketBot {
    constructor(gameId, botName, botId) {
        this.gameId = gameId;
        this.botName = botName;
        this.botId = botId;
        this.status = 'disconnected';
        this.messageQueue = [];
        this.isRunning = false;
    }
    
    async connect() {
        this.status = 'connecting';
        updateUI();
        
        try {
            // Simulate connection delay
            await this.delay(Math.random() * 1000 + 500);
            
            // In a real implementation, this would connect to Blooket's WebSocket
            // For now, we simulate a successful connection
            this.status = 'connected';
            this.isRunning = true;
            
            log(`✅ Bot '${this.botName}' connected to game ${this.gameId}`, 'success');
            updateUI();
            
            return true;
        } catch (error) {
            this.status = 'disconnected';
            log(`❌ Bot '${this.botName}' failed to connect: ${error.message}`, 'error');
            updateUI();
            return false;
        }
    }
    
    async sendMessage(message) {
        if (this.status !== 'connected') {
            log(`⚠️ Bot '${this.botName}' not connected, queuing message`, 'info');
            this.messageQueue.push(message);
            return false;
        }
        
        try {
            // Simulate sending message
            await this.delay(Math.random() * 500);
            log(`💬 Bot '${this.botName}' sent: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`, 'success');
            return true;
        } catch (error) {
            log(`❌ Bot '${this.botName}' failed to send message: ${error.message}`, 'error');
            return false;
        }
    }
    
    async sendAnswer(answer) {
        if (this.status !== 'connected') {
            log(`⚠️ Bot '${this.botName}' not connected, cannot send answer`, 'info');
            return false;
        }
        
        try {
            await this.delay(Math.random() * 200 + 100);
            log(`✅ Bot '${this.botName}' answered: ${answer}`, 'success');
            return true;
        } catch (error) {
            log(`❌ Bot '${this.botName}' failed to answer: ${error.message}`, 'error');
            return false;
        }
    }
    
    async disconnect() {
        this.status = 'disconnected';
        this.isRunning = false;
        log(`🔌 Bot '${this.botName}' disconnected`, 'info');
        updateUI();
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class BotManager {
    constructor() {
        this.bots = [];
        this.gameId = null;
        this.isSpawning = false;
    }
    
    async spawnBots(gameId, count, namePrefix, delayMs) {
        if (this.isSpawning) {
            log('❌ Already spawning bots, please wait...', 'error');
            return;
        }
        
        this.gameId = gameId;
        this.isSpawning = true;
        
        if (!gameId || gameId.trim() === '') {
            log('❌ Please enter a valid Game ID', 'error');
            this.isSpawning = false;
            return;
        }
        
        if (count < 1 || count > 100) {
            log('❌ Bot count must be between 1 and 100', 'error');
            this.isSpawning = false;
            return;
        }
        
        log(`🚀 Starting to spawn ${count} bots for game ${gameId}...`, 'info');
        log(`⏱️ Spawn delay: ${delayMs}ms per bot`, 'info');
        
        for (let i = 0; i < count; i++) {
            const botName = `${namePrefix}${i + 1}`;
            const bot = new BlooketBot(gameId, botName, this.bots.length);
            
            this.bots.push(bot);
            updateUI();
            
            // Connect bot with delay
            await bot.connect();
            await this.delay(delayMs);
        }
        
        this.isSpawning = false;
        log(`✅ Successfully spawned ${this.bots.length} bots!`, 'success');
        updateUI();
    }
    
    async sendMessageToAll(message) {
        if (this.bots.length === 0) {
            log('❌ No bots spawned yet', 'error');
            return;
        }
        
        log(`📨 Sending message to ${this.bots.length} bots...`, 'info');
        
        const results = await Promise.allSettled(
            this.bots.map(bot => bot.sendMessage(message))
        );
        
        const succeeded = results.filter(r => r.status === 'fulfilled' && r.value).length;
        const failed = results.filter(r => r.status === 'rejected' || !r.value).length;
        
        log(`📊 Results: ${succeeded} succeeded, ${failed} failed`, 'success');
        updateUI();
    }
    
    async sendAnswerToAll(answer) {
        if (this.bots.length === 0) {
            log('❌ No bots spawned yet', 'error');
            return;
        }
        
        log(`📨 Sending answer '${answer}' to ${this.bots.length} bots...`, 'info');
        
        const results = await Promise.allSettled(
            this.bots.map(bot => bot.sendAnswer(answer))
        );
        
        const succeeded = results.filter(r => r.status === 'fulfilled' && r.value).length;
        log(`✅ ${succeeded} bots answered`, 'success');
        updateUI();
    }
    
    async killAllBots() {
        if (this.bots.length === 0) {
            log('⚠️ No bots to kill', 'info');
            return;
        }
        
        log(`💀 Killing ${this.bots.length} bots...`, 'info');
        
        await Promise.all(
            this.bots.map(bot => bot.disconnect())
        );
        
        this.bots = [];
        log(`✅ All bots terminated`, 'success');
        updateUI();
    }
    
    getStats() {
        return {
            total: this.bots.length,
            active: this.bots.filter(b => b.status === 'connected').length,
            connecting: this.bots.filter(b => b.status === 'connecting').length,
            failed: this.bots.filter(b => b.status === 'disconnected').length
        };
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global bot manager instance
const botManager = new BotManager();

// Console logging
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
    
    // Auto-scroll to bottom
    consoleEl.scrollTop = consoleEl.scrollHeight;
}

function clearConsole() {
    consoleLogs.length = 0;
    renderConsole();
}
