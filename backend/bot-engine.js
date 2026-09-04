// backend/bot-engine.js
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');

class BlooketBot {
    constructor(botId, gameCode, username) {
        this.botId = botId;
        this.gameCode = gameCode;
        this.username = username;
        this.browser = null;
        this.page = null;
        this.status = 'initializing';
        this.lastAction = new Date();
        this.errorMessage = null;
    }

    async launch() {
        try {
            this.browser = await puppeteer.launch({
                headless: process.env.BROWSER_HEADLESS !== 'false',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--single-process',
                ]
            });

            this.page = await this.browser.newPage();
            this.page.setDefaultTimeout(parseInt(process.env.BROWSER_TIMEOUT || 30000));
            
            this.status = 'connecting';

            // Navigate to Blooket
            const gameUrl = `https://www.blooket.com/play/${this.gameCode}`;
            
            try {
                await this.page.goto(gameUrl, { waitUntil: 'networkidle2', timeout: 15000 });
            } catch (e) {
                this.errorMessage = 'Failed to load game page';
                throw e;
            }

            // Wait for game to load and find username input
            await this.page.waitForFunction(
                () => document.querySelector('input[placeholder*="name" i] || input[placeholder*="username" i] || input[type="text"]'),
                { timeout: 10000 }
            ).catch(() => null);

            // Enter username
            await this.page.evaluate((username) => {
                const inputs = document.querySelectorAll('input[type="text"]');
                if (inputs.length > 0) {
                    inputs[0].focus();
                    inputs[0].value = username;
                    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
                }
            }, this.username);

            await new Promise(r => setTimeout(r, 500));

            // Click join button
            await this.page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const joinBtn = buttons.find(btn => 
                    btn.textContent.toLowerCase().includes('join') || 
                    btn.textContent.toLowerCase().includes('play')
                );
                if (joinBtn) {
                    joinBtn.click();
                }
            });

            // Wait for game to fully load
            await new Promise(r => setTimeout(r, 2500));

            this.status = 'connected';
            console.log(`✅ Bot '${this.username}' connected`);
            return true;
        } catch (error) {
            this.status = 'failed';
            this.errorMessage = error.message;
            console.error(`❌ Bot '${this.username}' failed: ${error.message}`);
            await this.close();
            return false;
        }
    }

    async sendMessage(message) {
        if (this.status !== 'connected' || !this.page) return false;

        try {
            // Try to find and focus chat input
            await this.page.evaluate(() => {
                const inputs = document.querySelectorAll('input');
                const chatInput = Array.from(inputs).find(input => 
                    input.placeholder.toLowerCase().includes('chat') ||
                    input.placeholder.toLowerCase().includes('message')
                );
                if (chatInput) {
                    chatInput.focus();
                } else if (inputs.length > 0) {
                    // Fallback to first visible input
                    inputs[inputs.length - 1]?.focus();
                }
            });

            await this.page.keyboard.type(message, { delay: 5 });
            await this.page.keyboard.press('Enter');

            this.lastAction = new Date();
            console.log(`💬 Bot '${this.username}' sent message`);
            return true;
        } catch (error) {
            console.error(`Error: Bot '${this.username}' failed to send message`);
            return false;
        }
    }

    async sendAnswer(answer) {
        if (this.status !== 'connected' || !this.page) return false;

        try {
            // Look for answer buttons
            const answerFound = await this.page.evaluate((ans) => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const answerBtn = buttons.find(btn => 
                    btn.textContent.trim().toUpperCase() === ans.toUpperCase()
                );
                if (answerBtn) {
                    answerBtn.click();
                    return true;
                }
                return false;
            }, answer);

            if (answerFound) {
                this.lastAction = new Date();
                console.log(`✏️  Bot '${this.username}' answered: ${answer}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error: Bot '${this.username}' failed to answer`);
            return false;
        }
    }

    async close() {
        try {
            if (this.browser) {
                await this.browser.close();
            }
        } catch (e) {
            // Browser already closed
        }
        this.status = 'disconnected';
    }
}

class BotEngine {
    constructor() {
        this.bots = [];
        this.isSpawning = false;
    }

    async spawnBots(gameCode, count, namePrefix = 'Bot', spawnDelay = 500) {
        if (this.isSpawning) {
            throw new Error('Already spawning bots. Please wait...');
        }

        this.isSpawning = true;
        const botIds = [];

        try {
            for (let i = 0; i < count; i++) {
                const botId = uuidv4();
                const randomSuffix = Math.random().toString(36).substring(2, 6);
                const username = `${namePrefix}${i + 1}${randomSuffix}`;
                
                const bot = new BlooketBot(botId, gameCode, username);
                console.log(`\n🚀 Launching bot ${i + 1}/${count}: ${username}`);
                
                const success = await bot.launch();

                if (success) {
                    this.bots.push(bot);
                    botIds.push(botId);
                }

                // Delay between spawns
                if (i < count - 1) {
                    await new Promise(r => setTimeout(r, spawnDelay));
                }
            }

            console.log(`\n✨ Successfully spawned ${botIds.length}/${count} bots\n`);
            return botIds;
        } finally {
            this.isSpawning = false;
        }
    }

    async sendMessageToAll(message, botIds = null) {
        const targetBots = botIds 
            ? this.bots.filter(b => botIds.includes(b.botId))
            : this.bots.filter(b => b.status === 'connected');

        const results = await Promise.allSettled(
            targetBots.map(bot => bot.sendMessage(message))
        );

        const success = results.filter(r => r.status === 'fulfilled' && r.value).length;
        const failed = results.length - success;

        return {
            total: targetBots.length,
            success: success,
            failed: failed
        };
    }

    async sendAnswerToAll(answer, botIds = null) {
        const targetBots = botIds 
            ? this.bots.filter(b => botIds.includes(b.botId))
            : this.bots.filter(b => b.status === 'connected');

        const results = await Promise.allSettled(
            targetBots.map(bot => bot.sendAnswer(answer))
        );

        const success = results.filter(r => r.status === 'fulfilled' && r.value).length;
        const failed = results.length - success;

        return {
            total: targetBots.length,
            success: success,
            failed: failed
        };
    }

    async killAllBots() {
        console.log(`\n💀 Killing ${this.bots.length} bots...`);
        
        await Promise.allSettled(
            this.bots.map(bot => bot.close())
        );

        this.bots = [];
        console.log('✅ All bots terminated\n');
    }

    getStatus() {
        return {
            total: this.bots.length,
            connected: this.bots.filter(b => b.status === 'connected').length,
            connecting: this.bots.filter(b => b.status === 'connecting').length,
            failed: this.bots.filter(b => b.status === 'failed').length,
            bots: this.bots.map(b => ({
                id: b.botId,
                username: b.username,
                status: b.status,
                lastAction: b.lastAction,
                error: b.errorMessage
            }))
        };
    }
}

module.exports = BotEngine;
