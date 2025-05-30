// Icon-based verification system utilities
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

// Icons with emoji and names
const ICONS = [
    { name: 'apple', emoji: '🍎' },
    { name: 'banana', emoji: '🍌' },
    { name: 'orange', emoji: '🍊' },
    { name: 'grapes', emoji: '🍇' },
    { name: 'watermelon', emoji: '🍉' },
    { name: 'strawberry', emoji: '🍓' },
    { name: 'pineapple', emoji: '🍍' },
    { name: 'cherry', emoji: '🍒' },
    { name: 'peach', emoji: '🍑' },
    { name: 'lemon', emoji: '🍋' }
];

// Verification challenge expiration time in milliseconds (5 minutes)
const VERIFICATION_EXPIRATION = 5 * 60 * 1000;

/**
 * Creates a random verification challenge with icons
 * @returns {Object} Challenge data including target icon and options
 */
function createIconChallenge() {
    // Shuffle the icons and pick the first 4 as options
    const shuffledIcons = [...ICONS].sort(() => 0.5 - Math.random());
    const options = shuffledIcons.slice(0, 4);

    // Select one of the options as the target
    const targetIndex = Math.floor(Math.random() * options.length);
    const targetIcon = options[targetIndex];

    return {
        target: targetIcon,
        options: options
    };
}

/**
 * Creates an embed message with the target icon for verification
 * @param {Object} target - The target icon object
 * @returns {EmbedBuilder} Discord embed with the target icon
 */
function createTargetEmbed(target) {
    return new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle('Verification Challenge')
        .setDescription(`Please click on the **${target.name}** ${target.emoji} from the options below.`)
        .setFooter({ text: 'This verification helps us ensure you\'re human.' });
}

/**
 * Creates button components for the verification options
 * @param {Array} options - Array of icon options
 * @param {String} targetName - The name of the target icon
 * @returns {Array} Array of ActionRowBuilder objects with buttons
 */
function createIconButtons(options) {
    // Create buttons (up to 5 per row)
    const rows = [];
    let currentRow = new ActionRowBuilder();

    options.forEach((icon, index) => {
        const button = new ButtonBuilder()
            .setCustomId(`icon_select_${icon.name}`)
            .setLabel(icon.name)
            .setEmoji(icon.emoji)
            .setStyle(ButtonStyle.Secondary);

        currentRow.addComponents(button);

        // Create a new row after every 5 buttons or at the end
        if ((index + 1) % 5 === 0 || index === options.length - 1) {
            rows.push(currentRow);
            currentRow = new ActionRowBuilder();
        }
    });

    return rows;
}

/**
 * Verifies if the selected icon matches the target
 * @param {String} selectedIcon - The name of the selected icon
 * @param {String} targetIcon - The name of the target icon
 * @returns {Boolean} Whether the selected icon matches the target
 */
function verifyIconMatch(selectedIcon, targetIcon) {
    return selectedIcon === targetIcon;
}

/**
 * Cleans up expired verification challenges
 * @param {Map} activeVerifications - Map of active verification challenges
 */
function cleanupExpiredVerifications(activeVerifications) {
    const now = Date.now();

    for (const [userId, verification] of activeVerifications.entries()) {
        if (now - verification.timestamp > VERIFICATION_EXPIRATION) {
            activeVerifications.delete(userId);
            console.log(`Cleaned up expired verification for user ${userId}`);
        }
    }
}

module.exports = {
    createIconChallenge,
    createTargetEmbed,
    createIconButtons,
    verifyIconMatch,
    cleanupExpiredVerifications,
    VERIFICATION_EXPIRATION
};
