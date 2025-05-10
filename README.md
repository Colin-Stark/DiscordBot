# Discord Welcome Bot

A simple Discord bot that sends welcome messages to new members when they join your server.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure your `.env` file:
   - Make sure you have a `.env` file in the root directory
   - Add your Discord bot token as `DISCORD_TOKEN=your_token_here`
   - Add the channel ID where welcome messages should be sent as `WELCOME_CHANNEL_ID=your_channel_id`

3. Getting these values:
   - **Discord Bot Token**: Create a bot on the [Discord Developer Portal](https://discord.com/developers/applications)
   - **Welcome Channel ID**: Right-click on the channel in Discord and select "Copy ID" (Developer Mode must be enabled in Discord settings)

4. Run the bot:
   ```
   node index.js
   ```

## Features

- Welcomes new members with a customized message
- Logs bot initialization and new member joins in the console
- Automatically finds appropriate channels to send welcome messages
- Error handling to prevent crashes

## Customization

You can customize the welcome message by editing the text in `index.js`. Look for the line:
```javascript
channel.send(`Welcome to the server, ${member.user}! We're glad to have you here! 🎉`);
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
7. Select permissions: "Send Messages", "View Channels", "Read Message History"
8. Copy the generated URL and open it in your browser
9. Select the server to add your bot

## Troubleshooting

- If the bot doesn't send welcome messages, make sure the "SERVER MEMBERS INTENT" is enabled
- Check the console logs for any errors
- Verify that your bot has permission to send messages in the welcome channel
