# Discord Welcome & Verification Bot

A Discord bot that sends welcome messages to new members when they join your server and provides a verification system with gender role assignment.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure your `.env` file:
   - Make sure you have a `.env` file in the root directory
   - Add your Discord bot token as `DISCORD_TOKEN=your_token_here`
   - Add the channel ID where welcome messages should be sent as `WELCOME_CHANNEL_ID=your_channel_id`

3. Set up the required roles in your Discord server:
   - Create a role named `unverified` (assigned to new members)
   - Create a role named `male` (assigned to users who select Male)
   - Create a role named `female` (assigned to users who select Female)

4. Getting these values:
   - **Discord Bot Token**: Create a bot on the [Discord Developer Portal](https://discord.com/developers/applications)
   - **Welcome Channel ID**: Right-click on the channel in Discord and select "Copy ID" (Developer Mode must be enabled in Discord settings)

5. Run the bot:
   ```
   node index.js
   ```

## Features

- Welcomes new members with a customized message
- Logs bot initialization and new member joins in the console
- Automatically finds appropriate channels to send welcome messages
- Error handling to prevent crashes
- Green Verify button for user verification
- Verification process checking email and phone number validity
- Gender selection dropdown menu after successful verification
- Automatic role assignment based on gender selection

## Customization

You can customize the welcome message by editing the text in `src/newcomer/newcomerHandler.js`. Look for the line:
```javascript
channel.send({
    content: `Welcome to the server, ${member.user}! We're glad to have you here! 🎉`
});
```

## Running the Bot

You can run the bot using any of these methods:

1. Using node directly:
   ```
   node index.js
   ```

2. Using npm scripts:
   ```
   npm start
   ```

3. Development mode with auto-restart (requires nodemon):
   ```
   npm install -g nodemon
   npm run dev
   ```

## Inviting the Bot to Your Server

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to the "Bot" tab
4. Under "Privileged Gateway Intents", make sure "SERVER MEMBERS INTENT" is enabled
5. Go to the "OAuth2" tab, then "URL Generator"
6. Select the scopes: "bot"
7. Select permissions: "Send Messages", "View Channels", "Read Message History", "Manage Roles"
8. Copy the generated URL and open it in your browser
9. Select the server to add your bot

## Troubleshooting

- If the bot doesn't send welcome messages, make sure the "SERVER MEMBERS INTENT" is enabled
- Check the console logs for any errors
- Verify that your bot has permission to send messages in the welcome channel
- If role assignment doesn't work, verify that the bot has the "Manage Roles" permission
- Make sure the role names match exactly: "unverified", "male", and "female" (case insensitive)
- Ensure the bot's role is higher than the roles it's trying to assign in the server's role hierarchy

## Verification Process

1. When a new user joins, they receive a welcome message with a green Verify button.
2. Upon clicking the button, the bot checks for valid email and phone verification (simulated in this implementation).
3. After successful verification, the user is presented with a gender selection dropdown menu.
4. Based on the selected gender, the appropriate role is assigned and the 'unverified' role is removed.

> **Note:** The current implementation simulates email and phone number verification since Discord's API doesn't directly expose this information to bots. In a production environment, you would need to integrate this with a custom verification system.
