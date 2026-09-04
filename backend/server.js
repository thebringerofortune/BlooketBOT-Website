// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const BotEngine = require('./bot-engine');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Bot Engine Instance
const botEngine = new BotEngine();

// Log startup
console.log('\n🤖 Blooket Bot Manager API Server');
console.log('================================');
console.log(`📍 Starting on port ${PORT}...\n`);

// Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Spawn multiple bots
app.post('/api/spawn-bots', async (req, res) => {
    try {
        const { gameCode, count, namePrefix = 'Bot', spawnDelay = 500 } = req.body;

        if (!gameCode) {
            return res.status(400).json({ error: 'Game code required' });
        }

        if (count < 1 || count > 50) {
            return res.status(400).json({ error: 'Bot count must be 1-50' });
        }

        console.log(`\n🤖 Spawning ${count} bots for game ${gameCode}...`);
        
        const botIds = await botEngine.spawnBots(
            gameCode,
            count,
            namePrefix,
            spawnDelay
        );

        res.json({ 
            success: true, 
            message: `Spawned ${botIds.length} bots`,
            botIds 
        });
    } catch (error) {
        console.error('Error spawning bots:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Send message to all bots
app.post('/api/send-message', async (req, res) => {
    try {
        const { message, botIds } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message required' });
        }

        console.log(`💬 Sending message to bots: "${message.substring(0, 30)}..."`);
        const results = await botEngine.sendMessageToAll(message, botIds);
        
        res.json({ 
            success: true,
            results
        });
    } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Send answer to all bots
app.post('/api/send-answer', async (req, res) => {
    try {
        const { answer, botIds } = req.body;

        if (!answer) {
            return res.status(400).json({ error: 'Answer required' });
        }

        console.log(`✏️ Sending answer to bots: ${answer}`);
        const results = await botEngine.sendAnswerToAll(answer, botIds);
        
        res.json({ 
            success: true,
            results 
        });
    } catch (error) {
        console.error('Error sending answer:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get bot status
app.get('/api/bots', (req, res) => {
    const status = botEngine.getStatus();
    res.json(status);
});

// Kill all bots
app.post('/api/kill-all', async (req, res) => {
    try {
        console.log('\n🔪 Killing all bots...');
        await botEngine.killAllBots();
        res.json({ success: true, message: 'All bots terminated' });
    } catch (error) {
        console.error('Error killing bots:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get health status
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        bots: botEngine.bots.length,
        uptime: process.uptime()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`\n🌐 Open your browser and go to:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`\n📱 In GitHub Codespaces:`);
    console.log(`   Click the port notification or use the forwarded URL\n`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down server...');
    await botEngine.killAllBots();
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

module.exports = app;
