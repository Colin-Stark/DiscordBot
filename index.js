
// Discord bot that sends welcome messages when users join a server
const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Create a new client instance with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Listen for the guildMemberAdd event
client.on(Events.GuildMemberAdd, (member) => {
    try {
        // Send a welcome message to a designated channel
        const channelId = process.env.WELCOME_CHANNEL_ID;

        // If no channel ID is specified, try to find a system channel or default channel
        let channel;

        if (channelId && channelId !== 'your_welcome_channel_id_here') {
            channel = member.guild.channels.cache.get(channelId);
        } else {
            // Try to use the system channel (where Discord system messages are sent)
            channel = member.guild.systemChannel;

            // If no system channel, try to find a general/welcome channel
            if (!channel) {
                channel = member.guild.channels.cache.find(ch =>
                    ch.name.toLowerCase().includes('welcome') ||
                    ch.name.toLowerCase().includes('general'));
            }
        }

        if (channel && channel.isTextBased()) {
            channel.send(`Welcome to the server, ${member.user}! We're glad to have you here! 🎉`);
            console.log(`New member joined: ${member.user.tag}`);
        } else {
            console.log(`Could not find a suitable channel to welcome ${member.user.tag}`);
        }
    } catch (error) {
        console.error(`Error welcoming new member: ${error.message}`);
    }
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Bot logged in successfully!'))
    .catch(error => console.error(`Error logging in: ${error.message}`));
client.login(process.env.DISCORD_TOKEN);