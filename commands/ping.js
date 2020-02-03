const { RichEmbed } = require('discord.js');
const deleteMsg = require('../functions/deleteMsg');
const prefix = `@Pippi `;
const { put } = require('../functions/misc');

module.exports = {
   name: "ping",
   aliases: [],
   usage: `${prefix}ping`,
   perms: [],
   desc: `Pong! Te muestro la latencia de la API y mi latencia.`,
   run: async (pippi, msg, args, ops) => {
      deleteMsg(msg);
      const embed = new RichEmbed()
        .setAuthor(pippi.user.username, pippi.user.displayAvatarURL)
        .setTitle('Haciendo ping...')
        .setColor(put.orange)
        .setTimestamp();
      msg.channel.send(embed)
         .then(m => {
            setTimeout(async function() {
               let ping = await m.createdTimestamp - msg.createdTimestamp;
               let ch = await ['¿Realmente ese es mi ping? o.o', '¿Te parece que está bien? No lo puedo ver. XD', 'Sólo espero que no esté mal. uwu'];
               let answ = await ch[Math.floor(Math.random() * ch.length)];
               const eembed = new RichEmbed()
                  .setAuthor(pippi.user.username, pippi.user.displayAvatarURL)
                  .setTitle('Pong! 🏓')
                  .setDescription(`📥 **Mi latencia:** ${ping}ms
📡 **Latencia de DiscordAPI:** ${Math.floor(pippi.ping)}ms`)
                  .setColor(put.green)
                  .setFooter(answ)
                  .setTimestamp();
               await m.edit(eembed);
            }, 750);
        });
   }
}