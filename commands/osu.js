const { RichEmbed, Client } = require('discord.js');
const bd = require('quick.db');
const fetch = require('node-fetch');
const deleteMsg = require('../functions/deleteMsg');
const { osu } = require('../functions/settings');
const { put } = require('../functions/misc');
const pippi = new Client();

module.exports = {
   name: "osu",
   aliases: ['std'],
   usage: `${`${pippi.user} `}osu [opciones] [búsqueda]`,
   category: "osu!",
   perms: [],
   description: `Información osu!Standard`,
   run: async (pippi, msg, args) => {
      msg.content = msg.content.replace(/<@!652211403683397641>/g, '');
      if (args[args.length-1] !== '-ripple') {
         if (args[0] === '-set') {
            return msg.channel.send('La opción **-set** ha sido deshabilitada, debes especificar el usuario de osu!')
            .then(m => deleteMsg(m, 5000));
            if (!args[1]) {
               deleteMsg(msg, 5000);
               msg.channel.send('Debes escribir el nombre de usuario que deseas predeterminar.')
                  .then(m => deleteMsg(m, 4500));
               return;
            }
            let username = args.slice(1).join(' ');
            let url = `https://osu.ppy.sh/api/get_user?u=${username}&k=${osu.key}`;
            fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(osuInfo => {
               let x = osuInfo[0];
               bd.set(`osu.osu.${msg.author.id}.username`, x.username);
               bd.set(`osu.osu.${msg.author.id}.id`, x.user_id);
               msg.channel.send(new RichEmbed()
                  .setAuthor(pippi.user.username, pippi.user.displayAvatarURL)
                  .setTitle('¡Listo!')
                  .setThumbnail(msg.author.displayAvatarURL)
                  .setColor(put.green)
                  .addField('Nuevo nombre de usuario definido para <:EBosu:666406623232655370>', x.username)
                  .setTimestamp())
                  .then(m => deleteMsg(m, 5000));
            }).catch(() => msg.channel.send(`Parece que el nombre de usuario **${username}** no existe en <:EBosu:666406623232655370>\n*Asegúrate de haberlo escrito bien.*`)
               .then(m => deleteMsg(m, 5000)));
            return;
         }
         if (args[0] === '-top' || args[0] === '-t') {
            require('./top/osu')(pippi, msg, args, 0);
            return;
         }
         if (args[0] === '-recent' || args[0] === '-r') {
            require('./recent/osu')(pippi, msg, args, 0);
            return;
         }
         if (!args[0]) {
            return msg.channel.send('Debes especificar un nombre de usuario de osu!')
            .then(m => deleteMsg(m, 5000));
            let osuUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
            if (osuUser === null || osuUser === undefined) {
               deleteMsg(msg, 6000);
               msg.channel.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${`${pippi.user} `}osu -set <nombre de usuario>\` para definir tu nombre de usuario.*`)
                  .then(m => deleteMsg(m, 5500));
               return;
            }
            let url = `https://osu.ppy.sh/api/get_user?u=${osuUser}&k=${osu.key}`;
            fetch(url, { method: "Get" })
               .then(r => r.json())
               .then(osuInfo => {
                  let x = osuInfo[0];
                  let level = (Math.round(x.level * 100) / 100).toFixed(2);
                  const embed = new RichEmbed()
                  .setAuthor(`Perfil de osu!Standard de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${x.user_id}/osu`)
                  .setColor(msg.member.displayHexColor === '#000000' ? put.turquoise : msg.member.displayHexColor)
                  .setThumbnail(`https://a.ppy.sh/${x.user_id}`)
                  .addField('Ranking global', `\`\`\`fix\n# ${x.pp_rank}\`\`\``, true)
                  .addField(`Ranking :flag_${x.country.toLowerCase()}:`, `\`\`\`fix\n# ${x.pp_country_rank}\`\`\``, true)
                  .addBlankField()
                  .addField('Nivel', `${Math.floor(level)} (${Math.floor((level - Math.floor(level)) * 100)}%)`, true)
                  .addField('PP', Math.floor(parseInt(x.pp_raw)), true)
                  .addField('Accuracy', (Math.round(x.accuracy * 100) / 100).toFixed(2)+'%', true)
                  .addField('Conteo de jugadas', x.playcount, true)
                  .addField('Horas jugadas', `**${Math.floor(parseInt(x.total_seconds_played) / 3600)}**`, true)
                  .setFooter(`Se unió el ${x.join_date}`);
               msg.channel.send(embed);
               });
            return;
         }
         let member = msg.mentions.members.filter(m => m.id !== pippi.user.id).first();
         if (!member) {
            let username = args.slice(0).join(' ');
            let url = `https://osu.ppy.sh/api/get_user?u=${username}&k=${osu.key}`;
            fetch(url, { method: "Get" })
               .then(r => r.json())
               .then(osuInfo => {
                  let x = osuInfo[0];
                  let level = (Math.round(x.level * 100) / 100).toFixed(2);
                  const embed = new RichEmbed()
                     .setAuthor(`Perfil de osu!Standard de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${x.user_id}/osu`)
                     .setColor(put.turquoise)
                     .setThumbnail(`https://a.ppy.sh/${x.user_id}`)
                     .addField('Ranking global', `\`\`\`fix\n# ${x.pp_rank}\`\`\``, true)
                     .addField(`Ranking nacional :flag_${x.country.toLowerCase()}:`, `\`\`\`fix\n# ${x.pp_country_rank}\`\`\``, true)
                     .addBlankField()
                     .addField('Nivel', `${Math.floor(level)} (${Math.floor((level - Math.floor(level)) * 100)}%)`, true)
                     .addField('PP', Math.floor(parseInt(x.pp_raw)), true)
                     .addField('Accuracy', (Math.round(x.accuracy * 100) / 100).toFixed(2)+'%', true)
                     .addField('Conteo de jugadas', x.playcount, true)
                     .addField('Horas jugadas', `**${Math.floor(parseInt(x.total_seconds_played) / 3600)}**`, true)
                     .setFooter(`Se unió el ${x.join_date}`);
                  msg.channel.send(embed);
               }).catch(() => msg.channel.send(`No he podido encontrar a **${username}** en <:EBosu:666406623232655370>`)
                                 .then(m => deleteMsg(m, 5000)));
            return;
         }
         return msg.channel.send('Debes especificar un nombre de usuario de osu!')
         .then(m => deleteMsg(m, 5000));
         let osuUser = await bd.fetch(`osu.osu.${member.id}.username`);
         if (osuUser === null || osuUser === undefined) {
            deleteMsg(msg, 5000);
            msg.channel.send(`Parece que ${member} no tiene definido un usuario.`)
               .then(m => deleteMsg(m, 4500));
            return;
         }
         let url = `https://osu.ppy.sh/api/get_user?u=${osuUser}&k=${osu.key}`;
         fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(osuInfo => {
               let x = osuInfo[0];
               let level = (Math.round(x.level * 100) / 100).toFixed(2);
               const embed = new RichEmbed()
               .setAuthor(`Perfil de osu!Standard de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${x.user_id}/osu`)
               .setColor(member.displayHexColor === '#000000' ? put.turquoise : member.displayHexColor)
               .setThumbnail(`https://a.ppy.sh/${x.user_id}`)
               .addField('Ranking global', `\`\`\`fix\n# ${x.pp_rank}\`\`\``, true)
               .addField(`Ranking :flag_${x.country.toLowerCase()}:`, `\`\`\`fix\n# ${x.pp_country_rank}\`\`\``, true)
               .addBlankField()
               .addField('Nivel', `${Math.floor(level)} (${Math.floor((level - Math.floor(level)) * 100)}%)`, true)
               .addField('PP', Math.floor(parseInt(x.pp_raw)), true)
               .addField('Accuracy', (Math.round(x.accuracy * 100) / 100).toFixed(2)+'%', true)
               .addField('Conteo de jugadas', x.playcount, true)
               .addField('Horas jugadas', `**${Math.floor(parseInt(x.total_seconds_played) / 3600)}**`, true)
               .setFooter(`Se unió el ${x.join_date}`);
            msg.channel.send(embed);
            });
         return;
      }
      args.splice(args.length-1, 1);
      if (args[0] === '-set') {
         return msg.channel.send('La opción **-set** ha sido deshabilitada, debes especificar el usuario de Ripple.')
         .then(m => deleteMsg(m, 5000));
         if (!args[1]) {
            deleteMsg(msg, 5000);
            msg.channel.send('Debes escribir el nombre de usuario que deseas predeterminar.')
               .then(m => deleteMsg(m, 4500));
            return;
         }
         let username = args.slice(1).join(' ');
         let url = `http://ripple.moe/api/get_user?u=${username}&m=0`;
         fetch(url, { method: "Get" })
         .then(r => r.json())
         .then(rippleInfo => {
            let x = rippleInfo[0];
            bd.set(`ripple.ripple.${msg.author.id}.username`, x.username);
            bd.set(`ripple.ripple.${msg.author.id}.id`, x.user_id);
            msg.channel.send(new RichEmbed()
               .setAuthor(pippi.user.username, pippi.user.displayAvatarURL)
               .setTitle('¡Listo!')
               .setThumbnail(msg.author.displayAvatarURL)
               .setColor(put.green)
               .addField('Nuevo nombre de usuario definido para Ripple', x.username)
               .setTimestamp())
               .then(m => deleteMsg(m, 5000));
         }).catch(() => msg.channel.send(`Parece que el nombre de usuario **${username}** no existe en Ripple\n*Asegúrate de haberlo escrito bien.*`)
            .then(m => deleteMsg(m, 5000)));
         return;
      }
      if (!args[0]) {
         return msg.channel.send('Debes especificar un nombre de usuario de Ripple.')
         .then(m => deleteMsg(m, 5000));
         let osuUser = await bd.fetch(`ripple.ripple.${msg.author.id}.username`);
         if (osuUser === null || osuUser === undefined) {
            deleteMsg(msg, 6000);
            msg.channel.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${`${pippi.user} `}osu -set <nombre de usuario> -ripple\` para definir tu nombre de usuario.*`)
               .then(m => deleteMsg(m, 5500));
            return;
         }
         let url = `http://ripple.moe/api/get_user?u=${osuUser}&m=0`;
         fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(osuInfo => {
               let x = osuInfo[0];
               let level = (Math.round(x.level * 100) / 100).toFixed(2);
               const embed = new RichEmbed()
               .setAuthor(`Perfil de Ripple Standard de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://ripple.moe/u/${x.user_id}?mode=0`)
               .setColor(msg.member.displayHexColor === '#000000' ? put.turquoise : msg.member.displayHexColor)
               .setThumbnail(`https://a.ripple.moe/${x.user_id}`)
               .addField('Ranking global', `\`\`\`fix\n# ${x.pp_rank}\`\`\``, true)
               .addField(`Ranking :flag_${x.country.toLowerCase()}:`, `\`\`\`fix\n# ${x.pp_country_rank}\`\`\``, true)
               .addBlankField()
               .addField('Nivel', `${Math.floor(level)} (${Math.floor((level - Math.floor(level)) * 100)}%)`, true)
               .addField('PP', Math.floor(parseInt(x.pp_raw)), true)
               .addField('Accuracy', (Math.round(x.accuracy * 100) / 100).toFixed(2)+'%', true)
               .addField('Conteo de jugadas', x.playcount, true)
               .setTimestamp();
            msg.channel.send(embed);
            });
         return;
      }
      let member = msg.mentions.members.filter(m => m.id !== pippi.user.id).first();
      if (!member) {
         let username = args.slice(0).join(' ');
         let url = `http://ripple.moe/api/get_user?u=${username}&m=0`;
         fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(osuInfo => {
               let x = osuInfo[0];
               let level = (Math.round(x.level * 100) / 100).toFixed(2);
               const embed = new RichEmbed()
                  .setAuthor(`Perfil de Ripple Standard de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://ripple.moe/u/${x.user_id}?mode=0`)
                  .setColor(put.turquoise)
                  .setThumbnail(`https://a.ripple.moe/${x.user_id}`)
                  .addField('Ranking global', `\`\`\`fix\n# ${x.pp_rank}\`\`\``, true)
                  .addField(`Ranking nacional :flag_${x.country.toLowerCase()}:`, `\`\`\`fix\n# ${x.pp_country_rank}\`\`\``, true)
                  .addBlankField()
                  .addField('Nivel', `${Math.floor(level)} (${Math.floor((level - Math.floor(level)) * 100)}%)`, true)
                  .addField('PP', Math.floor(parseInt(x.pp_raw)), true)
                  .addField('Accuracy', (Math.round(x.accuracy * 100) / 100).toFixed(2)+'%', true)
                  .addField('Conteo de jugadas', x.playcount, true)
                  .setTimestamp();
               msg.channel.send(embed);
            }).catch(() => msg.channel.send(`No he podido encontrar a **${username}** en Ripple`)
                              .then(m => deleteMsg(m, 5000)));
         return;
      }
      return msg.channel.send('Debes especificar un nombre de usuario de Ripple.')
      .then(m => deleteMsg(m, 5000));
      let osuUser = await bd.fetch(`ripple.ripple.${member.id}.username`);
      if (osuUser === null || osuUser === undefined) {
         deleteMsg(msg, 5000);
         msg.channel.send(`Parece que ${member} no tiene definido un usuario.`)
            .then(m => deleteMsg(m, 4500));
         return;
      }
      let url = `http://ripple.moe/api/get_user?u=${osuUser}&m=0`;
      fetch(url, { method: "Get" })
         .then(r => r.json())
         .then(osuInfo => {
            let x = osuInfo[0];
            let level = (Math.round(x.level * 100) / 100).toFixed(2);
            const embed = new RichEmbed()
            .setAuthor(`Perfil de Ripple Standard de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://ripple.moe/u/${x.user_id}?mode=0`)
            .setColor(member.displayHexColor === '#000000' ? put.turquoise : member.displayHexColor)
            .setThumbnail(`https://a.ripple.moe/${x.user_id}`)
            .addField('Ranking global', `\`\`\`fix\n# ${x.pp_rank}\`\`\``, true)
            .addField(`Ranking :flag_${x.country.toLowerCase()}:`, `\`\`\`fix\n# ${x.pp_country_rank}\`\`\``, true)
            .addBlankField()
            .addField('Nivel', `${Math.floor(level)} (${Math.floor((level - Math.floor(level)) * 100)}%)`, true)
            .addField('PP', Math.floor(parseInt(x.pp_raw)), true)
            .addField('Accuracy', (Math.round(x.accuracy * 100) / 100).toFixed(2)+'%', true)
            .addField('Conteo de jugadas', x.playcount, true)
            .setTimestamp();
         msg.channel.send(embed);
         });
   }
}
