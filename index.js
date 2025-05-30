// Discord bot main entry point
const { Client, GatewayIntentBits } = require("discord.js");
const { setupEventHandlers } = require("./src/events/eventHandler");
const { cleanupExpiredVerifications } = require("./src/utils/iconVerification");
require("dotenv").config();

// Create a new client instance with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Set up all event handlers
setupEventHandlers(client);

// Access the activeVerifications map from verificationHandler
const { activeVerifications } = require("./src/verify/verificationHandler");

// Set up periodic cleanup of expired verifications (every 5 minutes)
setInterval(() => {
    cleanupExpiredVerifications(activeVerifications);
}, 5 * 60 * 1000);

// Log in to Discord with your client"s token
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log("Bot logged in successfully!"))
    .catch(error => console.error(`Error logging in: ${error.message}`));
