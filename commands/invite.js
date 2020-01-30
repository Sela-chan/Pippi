const { RichEmbed } = require('discord.js');
const prefix = '@Pippi ';

module.exports = {
   name: 'invite',
   aliases: ['inv'],
   usage: `${prefix}invite`,
   perms: [],
   desc: `Puedes invitarme a cualquier servidor en el que tengas el permiso *Administrar servidor*.`,
   run: async (pippi, msg, args) => {
      const embed = new RichEmbed()
      .setDescription('```fix\n( > w <)\n```')
      .setThumbnail(pippi.user.displayAvatarURL)
      .setImage('https://i.imgur.com/JZ22mIb.gif')
      .setAuthor('¡Haz clic aquí para invitarme!', pippi.user.displayAvatarURL, `https://discordapp.com/oauth2/`+
      `authorize?client_id=${pippi.user.id}&scope=bot&permissions=537226320`);
      msg.channel.send(embed)
      .then(m => {
         m.react('667478389216509992');
         m.react('667479062540713994');
         m.react('663277417313599516');
         m.react('661192987505590282');
      });
   }
}