const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require("quick.db")
const db = new QuickDB();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update-rebirths')
		.setDescription('Update rebirths of the player')
    .addNumberOption( option => option 
        .setName("rebirths")
        .setDescription("Player new amount of rebirths")
        .setRequired(true))
    .addUserOption(option => option
        .setName('user')
        .setDescription('Mention a User')),
	async execute(interaction) {
    stats = interaction.options.getNumber('rebirths')
    target = interaction.options.getUser('user')
    const member = interaction.member
    if (member.roles.cache.some(role => role.name === 'Leaderboard Manager')) {
    var user = target ? target : interaction.user
    const guildId = interaction.guild.id
    const userId = user.id;
    const key = `guild_${guildId}.${userId}.Rebirths`;
    const rebirths = await db.get(key)
    if(rebirths == null){
      interaction.reply(`User doesn't exist try adding the player`)
    }else{
    if(stats <= rebirths)return interaction.reply(`Rebirths can't be lower or the same as the players current rebirths.`);
    newStats = stats - rebirths
    totalStats = rebirths + newStats
    await db.set(key, totalStats);
    interaction.reply(`Updated ${user.username} with new total of ${totalStats}`)
    }
    }else{interaction.reply("You don't have permissions to do this command.")}
	},
};