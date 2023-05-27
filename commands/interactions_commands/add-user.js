const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require("quick.db")
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-user')
        .setDescription('Adds a user to the leaderboard with their rebirths')
        .addNumberOption( option => option 
            .setName("rebirths")
            .setDescription("Rebirths of the player.")
            .setRequired(true))
        .addUserOption(option => option
            .setName('user')
            .setDescription('Mention a User')
            .setRequired(true)),
    async execute(interaction, message) {
        const member = interaction.member
        if (member.roles.cache.some(role => role.name === 'Leaderboard Manager')) {
            rebirth = interaction.options.getNumber('rebirths')
            target = interaction.options.getUser('user')
            if(target){
                var user = target
                const key = `guild_${interaction.guild.id}.${user.id}`
                const guildTable = await db.get(key)
                if(guildTable == null){
                    await db.set(key, { [user.id]: { Rebirths: rebirth } });
                    interaction.reply(`added ${user.username} with ${rebirth} rebirths`)
                }else{
                    if(!guildTable[user.id]){
                        await db.set(`guild_${interaction.guild.id}.${user.id}`, { Rebirths: rebirth });
                        interaction.reply(`added ${user.username} with ${rebirth} rebirths`);
                    }else{
                        interaction.reply(`User ${user.username} already exists. Try updating the user's rebirths with the update-rebirths command.`);
                    }
                }
            }else{
              interaction.reply(`You need to mention a user.`);
            }
        }else{
            interaction.reply(`You don't have permissions to perform this command.`);
        }
    }
};

