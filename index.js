const fs = require('fs');
const path = require('path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ]
});

client.commands = new Collection();

// Add interaction commands to the collection
const interactionCommandsPath = path.join(__dirname, './commands/interactions_commands');
const interactionCommandFiles = fs.readdirSync(interactionCommandsPath).filter(file => file.endsWith('.js'));

for (const file of interactionCommandFiles) {
    const filePath = path.join(interactionCommandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Add old commands to the collection
const oldCommandsPath = path.join(__dirname, '/commands/old_commands');
const oldCommandFiles = fs.readdirSync(oldCommandsPath).filter(file => file.endsWith('.js'));

for (const file of oldCommandFiles) {
    const filePath = path.join(oldCommandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('execute' in command) {
        client.commands.set(file.slice(0, -3), command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "execute" property.`);
    }
}

const prefix = '!';

client.on("messageCreate", (message) => {
    console.log(`${message.author.username} said "${message.content}"`)
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // Handle old commands
    if (client.commands.has(command)) {
        try {
            client.commands.get(command).execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply("There was an error executing that command.");
        }
    }
});

client.on(Events.InteractionCreate, interaction => {
	console.log(interaction);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);
