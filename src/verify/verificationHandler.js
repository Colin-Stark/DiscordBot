// Verification handlers for the Discord bot
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { checkUserEmail, checkUserPhone } = require('../utils/verificationUtils');

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

        // Perform verification checks
        const hasEmail = await checkUserEmail(user);
        const hasPhone = await checkUserPhone(user);

        if (!hasEmail || !hasPhone) {
            // Verification failed
            await interaction.reply({
                content: 'Verification failed. Please make sure you have a valid email address and phone number attached to your account.',
                ephemeral: true // Only visible to the user who clicked
            });
            return;
        }

        // Send gender selection menu
        await interaction.reply({
            content: 'Verification successful! Please select your gender:',
            components: [createGenderSelectionMenu()],
            ephemeral: true
        });
    } catch (error) {
        console.error(`Error handling verification button: ${error.message}`);
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
    handleGenderSelection
};
