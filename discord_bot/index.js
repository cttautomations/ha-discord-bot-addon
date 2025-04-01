const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

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

// Create the Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Start the bot
console.log("🔄 Attempting to log in to Discord...");
client.login(token);
