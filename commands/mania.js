const { RichEmbed, Client } = require('discord.js');
const bd = require('quick.db');
const fetch = require('node-fetch');
const deleteMsg = require('../functions/deleteMsg');
const { prefix, osu } = require('../functions/settings');
const { put } = require('../functions/misc');
const pippi = new Client();

module.exports = {
   name: "mania",
   aliases: [],
   usage: `${`${pippi.user} `}mania [opciones] [búsqueda]`,
   category: "osu!",
   perms: [],
   description: `Información osu!Mania`,
   run: async (pippi, msg, args, ops) => {
      msg.content = msg.content.replace(/<@!652211403683397641>/g, '');
      if (args[args.length-1] !== '-ripple') {
         if (args[0] === '-set') {
            if (!args[1]) {
               deleteMsg(msg, 5000);
               msg.channel.send('Debes escribir el nombre de usuario que deseas predeterminar.')
                  .then(m => deleteMsg(m, 4500));
               return;
            }
            deleteMsg(msg);
            let username = args.slice(1).join(' ');
            let url = `https://osu.ppy.sh/api/get_user?u=${username}&k=${osu.key}&m=3`;
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
                  .addField('Nuevo nombre de usuario definido para <:osu:657311734654304286>', x.username)
                  .setTimestamp())
                  .then(m => deleteMsg(m, 5000));
            }).catch(() => msg.channel.send(`Parece que el nombre de usuario **${username}** no existe en <:osu:657311734654304286>\n*Asegúrate de haberlo escrito bien.*`)
               .then(m => deleteMsg(m, 5000)));
            return;
         }
         if (args[0] === '-top') {
            require('./top/mania')(pippi, msg, args, 3);
            return;
         }
         if (args[0] === '-recent') {
            require('./recent/mania')(pippi, msg, args, 3);
            return;
         }
         if (!args[0]) {
            let maniaUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
            if (maniaUser === null || maniaUser === undefined) {
               deleteMsg(msg, 6000);
               msg.channel.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${`${pippi.user} `}mania -set <nombre de usuario>\` para definir tu nombre de usuario.*`)
                  .then(m => deleteMsg(m, 5500));
               return;
            }
            let url = `https://osu.ppy.sh/api/get_user?u=${maniaUser}&k=${osu.key}&m=3`;
            fetch(url, { method: "Get" })
               .then(r => r.json())
               .then(osuInfo => {
                  let x = osuInfo[0];
                  deleteMsg(msg);
                  let level = (Math.round(x.level * 100) / 100).toFixed(2);
                  const embed = new RichEmbed()
                  .setAuthor(`Perfil de osu!Mania de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${x.user_id}/mania`)
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
         let member = msg.mentions.members.first();
         if (!member) {
            let username = args.slice(0).join(' ');
            let url = `https://osu.ppy.sh/api/get_user?u=${username}&k=${osu.key}&m=3`;
            fetch(url, { method: "Get" })
               .then(r => r.json())
               .then(osuInfo => {
                  let x = osuInfo[0];
                  deleteMsg(msg);
                  let level = (Math.round(x.level * 100) / 100).toFixed(2);
                  const embed = new RichEmbed()
                     .setAuthor(`Perfil de osu!Mania de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${x.user_id}/mania`)
                     .setColor(put.turquoise)
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
               }).catch(() => msg.channel.send(`No he podido encontrar a **${username}** en <:osu:657311734654304286>`)
                                 .then(m => deleteMsg(m, 5000)));
            return;
         }
         let maniaUser = await bd.fetch(`osu.osu.${member.id}.username`);
         if (maniaUser === null || maniaUser === undefined) {
            deleteMsg(msg, 5000);
            msg.channel.send(`Parece que ${member} no tiene definido un usuario.`)
               .then(m => deleteMsg(m, 4500));
            return;
         }
         let url = `https://osu.ppy.sh/api/get_user?u=${maniaUser}&k=${osu.key}&m=3`;
         fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(osuInfo => {
               let x = osuInfo[0];
               deleteMsg(msg);
               let level = (Math.round(x.level * 100) / 100).toFixed(2);
               const embed = new RichEmbed()
               .setAuthor(`Perfil de osu!Mania de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${x.user_id}/mania`)
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
         if (!args[1]) {
            deleteMsg(msg, 5000);
            msg.channel.send('Debes escribir el nombre de usuario que deseas predeterminar.')
               .then(m => deleteMsg(m, 4500));
            return;
         }
         deleteMsg(msg);
         let username = args.slice(1).join(' ');
         let url = `http://ripple.moe/api/get_user?u=${username}&m=3`;
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
         let osuUser = await bd.fetch(`ripple.ripple.${msg.author.id}.username`);
         if (osuUser === null || osuUser === undefined) {
            deleteMsg(msg, 6000);
            msg.channel.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${`${pippi.user} `}mania -set <nombre de usuario> -ripple\` para definir tu nombre de usuario.*`)
               .then(m => deleteMsg(m, 5500));
            return;
         }
         let url = `http://ripple.moe/api/get_user?u=${osuUser}&m=3`;
         fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(osuInfo => {
               let x = osuInfo[0];
               deleteMsg(msg);
               let level = (Math.round(x.level * 100) / 100).toFixed(2);
               const embed = new RichEmbed()
               .setAuthor(`Perfil de Ripple Mania de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://ripple.moe/u/${x.user_id}?mode=3`)
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
      let member = msg.mentions.members.first();
      if (!member) {
         let username = args.slice(0).join(' ');
         let url = `http://ripple.moe/api/get_user?u=${username}&m=3`;
         fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(osuInfo => {
               let x = osuInfo[0];
               deleteMsg(msg);
               let level = (Math.round(x.level * 100) / 100).toFixed(2);
               const embed = new RichEmbed()
                  .setAuthor(`Perfil de Ripple Mania de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://ripple.moe/u/${x.user_id}?mode=3`)
                  .setColor(put.turquoise)
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
            }).catch(() => msg.channel.send(`No he podido encontrar a **${username}** en Ripple`)
                              .then(m => deleteMsg(m, 5000)));
         return;
      }
      let maniaUser = await bd.fetch(`ripple.ripple.${member.id}.username`);
      if (maniaUser === null || maniaUser === undefined) {
         deleteMsg(msg, 5000);
         msg.channel.send(`Parece que ${member} no tiene definido un usuario.`)
            .then(m => deleteMsg(m, 4500));
         return;
      }
      let url = `http://ripple.moe/api/get_user?u=${maniaUser}&m=3`;
      fetch(url, { method: "Get" })
         .then(r => r.json())
         .then(osuInfo => {
            let x = osuInfo[0];
            deleteMsg(msg);
            let level = (Math.round(x.level * 100) / 100).toFixed(2);
            const embed = new RichEmbed()
            .setAuthor(`Perfil de Ripple Mania de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://ripple.moe/u/${x.user_id}?mode=3`)
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