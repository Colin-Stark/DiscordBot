// Newcomer handler for the Discord bot

/**
 * Assigns 'unverified' role to new members
 * @param {Object} member - Discord GuildMember object
 */
async function assignUnverifiedRole(member) {
    try {
        const unverifiedRole = member.guild.roles.cache.find(role => role.name.toLowerCase() === 'unverified');
        if (unverifiedRole) {
            await member.roles.add(unverifiedRole);
            console.log(`Assigned 'unverified' role to ${member.user.tag}`);
        } else {
            console.log(`'unverified' role not found for new member ${member.user.tag}`);
        }
    } catch (error) {
        console.error(`Failed to assign 'unverified' role: ${error.message}`);
    }
}

/**
 * Finds a suitable channel to send welcome messages
 * @param {Object} member - Discord GuildMember object
 * @param {string} channelId - Optional channel ID from environment variables
 * @returns {Object|null} Discord channel object or null if none found
 */
function findWelcomeChannel(member, channelId) {
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

    return channel && channel.isTextBased() ? channel : null;
}

/**
 * Sends welcome message to new members
 * @param {Object} member - Discord GuildMember object
 * @param {string} channelId - Optional channel ID from environment variables
 */
async function sendWelcomeMessage(member, channelId) {
    try {
        const channel = findWelcomeChannel(member, channelId);

        if (channel) {
            await channel.send({
                content: `Welcome to the server, ${member.user}! We're glad to have you here! 🎉`
            });
            console.log(`New member joined: ${member.user.tag}`);
        } else {
            console.log(`Could not find a suitable channel to welcome ${member.user.tag}`);
        }
    } catch (error) {
        console.error(`Error sending welcome message: ${error.message}`);
    }
}

/**
 * Handles new member joining the server
 * @param {Object} member - Discord GuildMember object
 * @param {string} channelId - Optional channel ID from environment variables
 */
async function handleNewMember(member, channelId) {
    try {
        await assignUnverifiedRole(member);
        await sendWelcomeMessage(member, channelId);
    } catch (error) {
        console.error(`Error handling new member: ${error.message}`);
    }
}

module.exports = {
    handleNewMember
};
