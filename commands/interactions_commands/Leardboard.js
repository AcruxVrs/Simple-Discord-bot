const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db")
const db = new QuickDB();


module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Shows leaderboard of players in the same guild'),
async execute(interaction) {
  console.log('Executing leaderboard command...');
  const key = `guild_${interaction.guild.id}`;
  console.log(`Retrieving data for key: ${key}`);
  const guildTable = await db.get(key);
  if (guildTable != null) {
    console.log('Data retrieved:', guildTable);
    const players = Object.entries(guildTable);
    if (players.length > 0) {
      console.log(`Building leaderboard with ${players.length} players...`);
      const leaderboard = new EmbedBuilder()
        .setTitle(`Leaderboard for guild ${interaction.guild.name} `)
        .setDescription('List of players and their rebirths in this guild')
        .setColor('#0099ff')
        .addFields(
          players.map(([id, player]) => {
            const user = interaction.client.users.cache.get(id);
            return { name: user.username, value: player.Rebirths };
          })
        )
        .build();
      console.log('Leaderboard built:', leaderboard);
      interaction.reply(leaderboard);
    } else {
      interaction.reply('There are no players to show on the leaderboard for this guild yet.Use the add - user command to add players to the leaderboard.');
    }
  } else {
    interaction.reply('There is no leaderboard data for this guild yet(Means it did not find a table for this guild).Maybe try adding a player with add - user command');
  }
},
};
