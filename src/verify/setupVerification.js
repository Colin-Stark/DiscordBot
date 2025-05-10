// Setup verification button and channel
const { createVerifyButton } = require('./verificationHandler');
const { ensureRequiredRoles } = require('../utils/verificationUtils');
require('dotenv').config();

/**
 * Places a verification button in the designated verification channel
 * @param {Object} client - Discord.js Client object
 */
async function setupVerificationChannel(client) {
    try {
        const channelId = process.env.VERIFICATION_CHANNEL_ID;

        if (!channelId) {
            console.warn('No verification channel ID set in environment variables.');
            return;
        }

        const channel = client.channels.cache.get(channelId);

        if (!channel) {
            console.error(`Could not find verification channel with ID: ${channelId}`);
            return;
        }        // Check if the guild has all required roles
        const foundRoles = await ensureRequiredRoles(channel.guild);

        // Extra check specifically for unverified role since it's critical for the verification system
        if (!foundRoles.unverified) {
            console.error(`Verification channel setup: 'Unverified' role is missing. The verification system will only work for users with this role.`);
        }

        // Check if there are any existing messages with verification buttons
        const messages = await channel.messages.fetch({ limit: 10 });
        const existingVerificationMessage = messages.find(m =>
            m.author.id === client.user.id &&
            m.components.length > 0 &&
            m.components[0].components.some(c => c.customId === 'verify_user')
        );

        // If there's already a verification message, don't create a new one
        if (existingVerificationMessage) {
            console.log('Verification button already exists in the channel.');
            return;
        }        // Create and send the verification message
        const row = createVerifyButton();
        await channel.send({
            content: '**Welcome to the server!** 👋\n\nIf you have the **Unverified** role, please click the verify button below to gain full access to the server.',
            components: [row]
        });

        console.log(`Verification button set up in channel: ${channel.name}`);
    } catch (error) {
        console.error(`Error setting up verification channel: ${error.message}`);
    }
}

module.exports = {
    setupVerificationChannel
};
