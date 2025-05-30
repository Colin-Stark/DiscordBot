// Verification handlers for the Discord bot
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { checkUserEmail, checkUserPhone } = require('../utils/verificationUtils');
const { createIconChallenge, createTargetEmbed, createIconButtons, verifyIconMatch } = require('../utils/iconVerification');

// Store active verification challenges by user ID
const activeVerifications = new Map();

/**
 * Creates a verification button for new members
 * @returns {ActionRowBuilder} Row containing the verify button
 */
function createVerifyButton() {
    const verifyButton = new ButtonBuilder()
        .setCustomId('verify_user')
        .setLabel('Verify')
        .setStyle(ButtonStyle.Success);

    return new ActionRowBuilder().addComponents(verifyButton);
}

/**
 * Creates a gender selection menu
 * @returns {ActionRowBuilder} Row containing the gender selection menu
 */
function createGenderSelectionMenu() {
    const genderSelect = new StringSelectMenuBuilder()
        .setCustomId('gender_select')
        .setPlaceholder('Select your gender')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Male')
                .setValue('male'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Female')
                .setValue('female')
        );

    return new ActionRowBuilder().addComponents(genderSelect);
}

/**
 * Handles verification button click events
 * @param {Object} interaction - Discord interaction object
 */
async function handleVerifyButton(interaction) {
    try {
        // Get user and member objects
        const user = interaction.user;
        const member = interaction.member;

        // Check if user has the unverified role
        const unverifiedRole = member.guild.roles.cache.find(role => role.name.toLowerCase() === 'unverified');
        const hasUnverifiedRole = unverifiedRole && member.roles.cache.has(unverifiedRole.id);

        if (!hasUnverifiedRole) {
            // User doesn't have the unverified role
            await interaction.reply({
                content: 'You are already verified or don\'t need verification.',
                ephemeral: true
            });
            return;
        }

        // Create an icon verification challenge
        const challenge = createIconChallenge();

        // Store the challenge in our active verifications map
        activeVerifications.set(user.id, {
            targetIcon: challenge.target.name,
            timestamp: Date.now()
        });

        // Create the embed message with the target icon
        const embed = createTargetEmbed(challenge.target);

        // Create the buttons for icon selection
        const buttonRows = createIconButtons(challenge.options);

        // Send the verification challenge
        await interaction.reply({
            content: 'Please complete the verification challenge:',
            embeds: [embed],
            components: buttonRows,
            ephemeral: true // Only visible to the user who clicked
        });
    } catch (error) {
        console.error(`Error handling verification button: ${error.message}`);
        throw error;
    }
}

/**
 * Handles icon selection button clicks
 * @param {Object} interaction - Discord interaction object
 */
async function handleIconSelection(interaction) {
    try {
        const user = interaction.user;
        const customId = interaction.customId;

        // Extract the selected icon from the customId (format: icon_select_iconname)
        const selectedIcon = customId.replace('icon_select_', '');

        // Check if user has an active verification
        if (!activeVerifications.has(user.id)) {
            await interaction.reply({
                content: 'Your verification session has expired. Please click the verify button again.',
                ephemeral: true
            });
            return;
        }

        // Get the verification challenge
        const verification = activeVerifications.get(user.id);
        const targetIcon = verification.targetIcon;

        // Check if the selected icon matches the target
        if (verifyIconMatch(selectedIcon, targetIcon)) {
            // Successful verification, clean up
            activeVerifications.delete(user.id);

            // Send gender selection menu
            await interaction.update({
                content: 'Verification successful! Please select your gender:',
                embeds: [],
                components: [createGenderSelectionMenu()],
            });
        } else {
            // Failed verification
            activeVerifications.delete(user.id);

            await interaction.update({
                content: 'Verification failed! You selected the wrong icon. Please try again by clicking the verify button.',
                embeds: [],
                components: [],
            });
        }
    } catch (error) {
        console.error(`Error handling icon selection: ${error.message}`);
        throw error;
    }
}

/**
 * Handles gender selection menu interactions
 * @param {Object} interaction - Discord interaction object
 */
async function handleGenderSelection(interaction) {
    try {
        const selectedGender = interaction.values[0];
        const member = interaction.member;

        // Find roles
        const maleRole = member.guild.roles.cache.find(role => role.name.toLowerCase() === 'male');
        const femaleRole = member.guild.roles.cache.find(role => role.name.toLowerCase() === 'female');
        const unverifiedRole = member.guild.roles.cache.find(role => role.name.toLowerCase() === 'unverified');
        const verifiedRole = member.guild.roles.cache.find(role => role.name.toLowerCase() === 'verified');

        // Remove unverified role if it exists
        if (unverifiedRole) {
            await member.roles.remove(unverifiedRole);
        }

        // Add verified role if it exists
        if (verifiedRole) {
            await member.roles.add(verifiedRole);
        } else {
            console.warn(`'Verified' role not found in server ${member.guild.name}`);
        }

        // Assign the appropriate role based on gender selection
        if (selectedGender === 'male' && maleRole) {
            await member.roles.add(maleRole);
            await interaction.update({
                content: 'Verification complete! You have been assigned the Male role.',
                components: [],
            });
        } else if (selectedGender === 'female' && femaleRole) {
            await member.roles.add(femaleRole);
            await interaction.update({
                content: 'Verification complete! You have been assigned the Female role.',
                components: [],
            });
        } else {
            // Role not found
            await interaction.update({
                content: `Verification complete! However, the ${selectedGender} role could not be assigned. Please contact an administrator.`,
                components: [],
            });
        }
    } catch (error) {
        console.error(`Error handling gender selection: ${error.message}`);
        throw error;
    }
}

module.exports = {
    createVerifyButton,
    handleVerifyButton,
    handleIconSelection,
    handleGenderSelection,
    activeVerifications
};
