const { RichEmbed } = require('discord.js');
const deleteMsg = require('../functions/deleteMsg');
const prefix = '@Pippi ';
const put = require('../functions/misc');

module.exports = {
   name: 'help',
   aliases: ['h'],
   usage: `${prefix}help`,
   perms: [],
   desc: `Mira todos los comandos que puedes usar.`,
   run: async (SM, msg, args) => {
      deleteMsg(msg);
      let commands = SM.commands.map(c => `**${c.name}**`);
      const embed = new RichEmbed()
         .setAuthor(SM.user.username, SM.user.displayAvatarURL)
         .setDescription(`Hola, ${msg.author}, aquí están los comandos que puedes usar.`)
         .setThumbnail(msg.author.displayAvatarURL)
         .setColor(msg.member.displayHexColor === '#000000' ? put.lFuchsia : msg.member.displayHexColor)
         .addField(`Prefijo`, `\`${prefix}\``)
         .addField('Opciones', `\`-top\`: Mira los 20 mejores rendimientos de cualquier jugador en los diferentes modos de juego.\n`+
         `\`-recent\`: Mira las 10 jugadas recientes de cualquier jugador en los diferentes modos de juego. (Si las tiene)`)
         .setFooter(`<> = Requerido / [] = Opcional`)
         .setTimestamp();
      for (i = 0; i < commands.length; i++) {
         embed.addField(commands[i], SM.commands.map(c => `Alias: ${c.aliases.length < 1 ? 'No tiene alias.' : `\`${c.aliases.toString().replace(/,/g, ', ')}\``}
         Uso: \`${c.usage}\`
         Descripción:\n\`\`\`fix\n${c.desc}\`\`\``)[i]);
      }
      msg.channel.send(embed)
         .then(m => {
            deleteMsg(m, 10000);
            setTimeout(() => {
               msg.reply('revisa tus PMs. uwu')
                  .then(m => deleteMsg(m, 5000));
               msg.author.send(embed);
            }, 10000);
         });
   }
}