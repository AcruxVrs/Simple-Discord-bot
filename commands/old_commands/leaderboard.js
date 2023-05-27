const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db")
const db = new QuickDB();

module.exports = {
  name: "leaderboard",
  execute: async (message) => { 
  console.log('Executing leaderboard command...');
  const guildId = message.guild.id;
  const key = `guild_${guildId}`;
  console.log(`Retrieving data for key: ${key}`);
  const guildTable = await db.get(key);
  if (guildTable != null) {
    console.log('Data retrieved:', guildTable);
    const players = Object.entries(guildTable);
    if (players.length > 0) {
      console.log(`Building leaderboard with ${players.length} players...`);
      const fields = players.map(([id, player]) => {
        const user = message.client.users.cache.get(id);
        return { name: user.username, value: `"${player.Rebirths}" `};
      });
      
      // test to check if the fields variable is defined
      if (!fields) {
        console.error("fields variable is not defined");
        return;
      }

      // test to check if the fields variable is an array
      if (!Array.isArray(fields)) {
        console.error("fields variable is not an array");
        return;
      }
      
      // test to check if the fields variable has the correct format
      if (!fields.every(field => field.name && field.value)) {
        console.error("fields variable has incorrect format");
        return;
      }
      try{
      console.log(JSON.stringify(...fields))
      const leaderboard = new EmbedBuilder()
        .setTitle(`Leaderboard for guild ${message.guild.name}`)
        .setDescription('List of players and their rebirths in this guild')
        .setColor('#0099ff')
      .addFields(fields)
      console.log('Leaderboard built:', leaderboard);
      message.channel.send({embeds: [leaderboard]});
      }catch(err) {console.log(err)
        console.log(JSON.stringify(err))}
      
    } else {
      message.channel.send('There are no players to show on the leaderboard for this guild yet. Use the add-user command to add players to the leaderboard.');
    }
  } else {
    message.channel.send('There is no leaderboard data for this guild yet(Means it did not find a table for this guild).Maybe try adding a player with add-user command');
  }
}
};
