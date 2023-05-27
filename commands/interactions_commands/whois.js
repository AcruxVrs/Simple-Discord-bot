const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whois')
		.setDescription('Replies with information  about a user')
    .addUserOption(option => option
        .setName('user')
        .setDescription('Mention a User')
        .setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getMember('user')
    
    if(user){
      
      
  
    const member = user
      console.log(member)

    let x = Date.now() - member.createdAt;
    let y = Date.now() - user.guild.members.cache.get(member.id).joinedAt;
    const joined = Math.floor(y / 86400000);

    const joineddate = moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
    



UserEmbeds = 
    {
      "type": "rich",
      "title": "",
      "description": "",
      "color": 0x00FFFF,
      "fields": [
        {
          "name": `Member ID`,
          "value": `${member.id}`
        },
        {
          "name": `Roles`,
          "value": `<@&${member._roles.join('> <@&')}>`
        },
        {
          "name": `Account Created On:`,
          "value": `${moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY")}`,
          "inline": true
        },
        {
          "name": `Joined the server At`,
          "value": `${joineddate}, ${joined} day/s Ago`
        },
        
      ],
      "thumbnail": {
        "url": `${member.user.displayAvatarURL({ format: "png", dynamic: true })}`,
        "height": 0,
        "width": 0
      },
      "author": {
        "name": `${user.user.tag}`,
        "url": `${member.user.displayAvatarURL({ dynamic: true })}`
      },
      "footer": {
        "text": `Requested by ${user.user.tag}`
      }
    }
  
        
                                        
                                      
  

    interaction.channel.send({ embeds: [UserEmbeds] });
    
              
    
      
    }else{interaction.reply(`Please mention a user`)}
	},
};