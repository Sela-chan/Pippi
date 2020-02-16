const { RichEmbed } = require('discord.js');
const prefix = '@Pippi ';

module.exports = {
   name: 'vote',
   aliases: [],
   usage: `${prefix}vote`,
   perms: [],
   desc: `¡Vota por mí!`,
   run: async (pippi, msg, args) => {
      const embed = new RichEmbed()
      .setDescription('```fix\n( ^ w ^)\n```')
      .setThumbnail(pippi.user.displayAvatarURL)
      .setImage('https://i.redd.it/eizu56ad4ne21.jpg')
      .setAuthor('¡Haz clic aquí para votar por mí!', pippi.user.displayAvatarURL, `https://top.gg/bot/652211403683397641`);
      msg.channel.send(embed)
      .then(m => {
         m.react('667478389216509992');
         m.react('667479062540713994');
         m.react('663277417313599516');
         m.react('661192987505590282');
      });
   }
}