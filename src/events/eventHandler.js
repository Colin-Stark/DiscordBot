// Event handlers for the Discord bot
const { Events } = require('discord.js');
const { handleNewMember } = require('../newcomer/newcomerHandler');
const { handleVerifyButton, handleGenderSelection } = require('../verify/verificationHandler');
const { setupVerificationChannel } = require('../verify/setupVerification');

/**
 * Sets up event handlers for the Discord client
 * @param {Object} client - Discord.js Client object
 */
function setupEventHandlers(client) {
    // When the client is ready, run this code (only once)
    client.once(Events.ClientReady, (readyClient) => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);

        // Set up the verification channel with verification button
        setupVerificationChannel(client);
    });

    // Listen for the guildMemberAdd event
    client.on(Events.GuildMemberAdd, (member) => {
        const channelId = process.env.WELCOME_CHANNEL_ID;
        handleNewMember(member, channelId);
    });

    // Handle interactions with buttons and select menus
    client.on(Events.InteractionCreate, async interaction => {
        try {
            // Handle button interactions
            if (interaction.isButton()) {
                if (interaction.customId === 'verify_user') {
                    await handleVerifyButton(interaction);
                }
            }

            // Handle select menu interactions
            if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'gender_select') {
                    await handleGenderSelection(interaction);
                }
            }

        } catch (error) {
            console.error(`Error handling interaction: ${error.message}`);

            // Try to respond to the user if possible
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error processing your verification. Please try again later or contact an administrator.',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: 'There was an error processing your verification. Please try again later or contact an administrator.',
                    ephemeral: true
                });
            }
        }
    });
}

module.exports = {
    setupEventHandlers
};
