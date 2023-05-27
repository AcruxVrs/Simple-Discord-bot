const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require("quick.db")
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rebirths')
    .setDescription('Replies with user rebirths')
    .addUserOption(option => option
      .setName('user')
      .setDescription('Mention a User')
      .setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const key = `guild_${interaction.guild.id}.${target.id}`;
    const userTable = await db.get(key);
    if (userTable != null) {
      const rebirths = userTable.Rebirths;
      interaction.reply(`${target.username} rebirths are ${rebirths}`)
    } else {
      interaction.reply("User doesnt have data in this guild")
    }
  }
};