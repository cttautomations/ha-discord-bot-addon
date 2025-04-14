const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const axios = require('axios'); // Add this if it's not already in your package

// Load Discord token from Home Assistant add-on config
let config;
try {
  config = JSON.parse(fs.readFileSync('/data/options.json', 'utf8'));
} catch (error) {
  console.error("❌ Failed to read /data/options.json:", error);
  process.exit(1);
}

const token = config.discord_token;

if (!token) {
  console.error("❌ No Discord token found in add-on config!");
  process.exit(1);
}

// Create the Discord client with message-related intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // 👈 Required to read actual message text
  ]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Listen for messages in #health-and-nutrition🩺
client.on('messageCreate', async (message) => {
  // Ignore other bots
  if (message.author.bot) return;

  // Match the channel name exactly (case-sensitive emoji name works)
  if (message.channel.name === 'health-and-nutrition🩺') {
    try {
      await axios.post('http://raspberrypiself.local:5678/webhook/health-interaction', {
        message: message.content,
        user: message.author.username,
        channel: message.channel.name,
        timestamp: message.createdAt.toISOString()
      });
      console.log(`📤 Message sent to n8n: ${message.content}`);
    } catch (err) {
      console.error(`❌ Failed to POST to n8n:`, err.message);
    }
  }
});

// Start the bot
console.log("🔄 Attempting to log in to Discord...");
client.login(token);
