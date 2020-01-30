const { RichEmbed } = require('discord.js');
const bd = require('quick.db');
const fetch = require('node-fetch');
const deleteMsg = require('../functions/deleteMsg');
const imgur = require('../functions/imgur');
const { osu } = require('../functions/settings');
const { put } = require('../functions/misc');
const prefix = '@Pippi ';

module.exports = {
   name: "taiko",
   aliases: [],
   usage: `${prefix}taiko [opciones] <usuario>`,
   perms: [],
   desc: `Información osu!Taiko`,
   run: async (pippi, msg, args, ops) => {
      await msg.channel.fetchWebhooks()
      .then(async wh => {
         if (!wh.find(w => w.name === 'Taiko!')) {
            msg.channel.send(`Para poder usarme en ${msg.channel} debes primero usar el comando \`${prefix}createwh\`.`)
            .then(m => deleteMsg(m, 6000));
            return;
         }
         var wTaiko = await wh.find(w => w.name === 'Taiko!');
      msg.content = msg.content.replace(/<@!652211403683397641>/g, '');
      if (args[args.length-1] !== '-ripple') {
         if (args[0] === '-set') {
            return await wTaiko.send('La opción **-set** ha sido deshabilitada, debes especificar el usuario de <:EBosu:657311734654304286>.')
            .then(m => deleteMsg(m, 5000));
            if (!args[1]) {
               deleteMsg(msg, 5000);
               await wTaiko.send('Debes escribir el nombre de usuario que deseas predeterminar.')
                  .then(m => deleteMsg(m, 4500));
               return;
            }
            let username = args.slice(1).join(' ');
            let url = `https://osu.ppy.sh/api/get_user?u=${username}&k=${osu.key}&m=1`;
            fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(async osuInfo => {
               let x = osuInfo[0];
               bd.set(`osu.osu.${msg.author.id}.username`, x.username);
               bd.set(`osu.osu.${msg.author.id}.id`, x.user_id);
               await wTaiko.send(new RichEmbed()
                  .setAuthor(pippi.user.username, pippi.user.displayAvatarURL)
                  .setTitle('¡Listo!')
                  .setThumbnail(msg.author.displayAvatarURL)
                  .setColor(put.green)
                  .addField('Nuevo nombre de usuario definido para <:EBosu:657311734654304286>', x.username)
                  .setTimestamp())
                  .then(m => deleteMsg(m, 5000));
            }).catch(async () => await wTaiko.send(`Parece que el nombre de usuario **${username}** no existe en <:EBosu:657311734654304286>\n*Asegúrate de haberlo escrito bien.*`)
               .then(m => deleteMsg(m, 5000)));
            return;
         }
         if (args[0] === '-top' || args[0] === '-t') {
            require('./top/taiko')(pippi, msg, wTaiko, args, 1);
            return;
         }
         if (args[0] === '-recent' || args[0] === '-r') {
            require('./recent/taiko')(pippi, msg, wTaiko, args, 1);
            return;
         }
         if (!args[0]) {
            return await wTaiko.send('Debes especificar un nombre de usuario de osu!')
            .then(m => deleteMsg(m, 5000));
            let taikoUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
            if (taikoUser === null || taikoUser === undefined) {
               deleteMsg(msg, 6000);
               await wTaiko.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${prefix}taiko -set <nombre de usuario>\` para definir tu nombre de usuario.*`)
                  .then(m => deleteMsg(m, 5500));
               return;
            }
            let url = `https://osu.ppy.sh/api/get_user?u=${taikoUser}&k=${osu.key}&m=1`;
            fetch(url, { method: "Get" })
               .then(r => r.json())
               .then(async osuInfo => {
                  let x = osuInfo[0];
                  let level = (Math.round(x.level * 100) / 100).toFixed(2);
                  const embed = new RichEmbed()
                  .setAuthor(`Perfil de osu!Taiko de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${x.user_id}/taiko`)
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
               await wTaiko.send(embed);
               });
            return;
         }
         let member = msg.mentions.members.filter(m => m.id !== pippi.user.id).first();
         if (!member) {
            let username = args.slice(0).join(' ');
            let url = `https://osu.ppy.sh/api/get_user?u=${username}&k=${osu.key}&m=1`;
            fetch(url, { method: "Get" })
               .then(r => r.json())
               .then(async osuInfo => {
                  let x = osuInfo[0];
                  let level = (Math.round(x.level * 100) / 100).toFixed(2);
                  const embed = new RichEmbed()
                     .setAuthor(`Perfil de osu!Taiko de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${x.user_id}/taiko`)
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
                  await wTaiko.send(embed);
               }).catch(async () => await wTaiko.send(`No he podido encontrar a **${username}** en <:EBosu:657311734654304286>`)
                                 .then(m => deleteMsg(m, 5000)));
            return;
         }
         return await wTaiko.send('Debes especificar un nombre de usuario de osu!')
         .then(m => deleteMsg(m, 5000));
         let taikoUser = await bd.fetch(`osu.osu.${member.id}.username`);
         if (taikoUser === null || taikoUser === undefined) {
            deleteMsg(msg, 5000);
            await wTaiko.send(`Parece que ${member} no tiene definido un usuario.`)
               .then(m => deleteMsg(m, 4500));
            return;
         }
         let url = `https://osu.ppy.sh/api/get_user?u=${taikoUser}&k=${osu.key}&m=1`;
         fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(async osuInfo => {
               let x = osuInfo[0];
               let level = (Math.round(x.level * 100) / 100).toFixed(2);
               const embed = new RichEmbed()
               .setAuthor(`Perfil de osu!Taiko de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${x.user_id}/taiko`)
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
            await wTaiko.send(embed);
            });
         return;
      }
      args.splice(args.length-1, 1);
      if (args[0] === '-set') {
         return await wTaiko.send('La opción **-set** ha sido deshabilitada, debes especificar el usuario de Ripple.')
         .then(m => deleteMsg(m, 5000));
         if (!args[1]) {
            deleteMsg(msg, 5000);
            await wTaiko.send('Debes escribir el nombre de usuario que deseas predeterminar.')
               .then(m => deleteMsg(m, 4500));
            return;
         }
         let username = args.slice(1).join(' ');
         let url = `http://ripple.moe/api/get_user?u=${username}&m=1`;
         fetch(url, { method: "Get" })
         .then(r => r.json())
         .then(async rippleInfo => {
            let x = rippleInfo[0];
            bd.set(`ripple.ripple.${msg.author.id}.username`, x.username);
            bd.set(`ripple.ripple.${msg.author.id}.id`, x.user_id);
            await wTaiko.send(new RichEmbed()
               .setAuthor(pippi.user.username, pippi.user.displayAvatarURL)
               .setTitle('¡Listo!')
               .setThumbnail(msg.author.displayAvatarURL)
               .setColor(put.green)
               .addField('Nuevo nombre de usuario definido para Ripple', x.username)
               .setTimestamp())
               .then(m => deleteMsg(m, 5000));
         }).catch(async () => await wTaiko.send(`Parece que el nombre de usuario **${username}** no existe en Ripple\n*Asegúrate de haberlo escrito bien.*`)
            .then(m => deleteMsg(m, 5000)));
         return;
      }
      if (!args[0]) {
         return await wTaiko.send('Debes especificar un nombre de usuario de Ripple.')
         .then(m => deleteMsg(m, 5000));
         let osuUser = await bd.fetch(`ripple.ripple.${msg.author.id}.username`);
         if (osuUser === null || osuUser === undefined) {
            deleteMsg(msg, 6000);
            await wTaiko.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${prefix}taiko -set <nombre de usuario> -ripple\` para definir tu nombre de usuario.*`)
               .then(m => deleteMsg(m, 5500));
            return;
         }
         let url = `http://ripple.moe/api/get_user?u=${osuUser}&m=1`;
         fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(async osuInfo => {
               let x = osuInfo[0];
               let level = (Math.round(x.level * 100) / 100).toFixed(2);
               const embed = new RichEmbed()
               .setAuthor(`Perfil de Ripple Taiko de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://ripple.moe/u/${x.user_id}?mode=1`)
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
            await wTaiko.send(embed);
            });
         return;
      }
      let member = msg.mentions.members.filter(m => m.id !== pippi.user.id).first();
      if (!member) {
         let username = args.slice(0).join(' ');
         let url = `http://ripple.moe/api/get_user?u=${username}&m=1`;
         fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(async osuInfo => {
               let x = osuInfo[0];
               let level = (Math.round(x.level * 100) / 100).toFixed(2);
               const embed = new RichEmbed()
                  .setAuthor(`Perfil de Ripple Taiko de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://ripple.moe/u/${x.user_id}?mode=1`)
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
               await wTaiko.send(embed);
            }).catch(async () => await wTaiko.send(`No he podido encontrar a **${username}** en Ripple`)
                              .then(m => deleteMsg(m, 5000)));
         return;
      }
      return await wTaiko.send('Debes especificar un nombre de usuario de osu!')
      .then(m => deleteMsg(m, 5000));
      let taikoUser = await bd.fetch(`ripple.ripple.${member.id}.username`);
      if (taikoUser === null || taikoUser === undefined) {
         deleteMsg(msg, 5000);
         await wTaiko.send(`Parece que ${member} no tiene definido un usuario.`)
            .then(m => deleteMsg(m, 4500));
         return;
      }
      let url = `http://ripple.moe/api/get_user?u=${taikoUser}&m=1`;
      fetch(url, { method: "Get" })
         .then(r => r.json())
         .then(async osuInfo => {
            let x = osuInfo[0];
            let level = (Math.round(x.level * 100) / 100).toFixed(2);
            const embed = new RichEmbed()
            .setAuthor(`Perfil de Ripple Taiko de ${x.username}`, `https://osu.ppy.sh/images/flags/${x.country.toUpperCase()}.png`, `https://ripple.moe/u/${x.user_id}?mode=1`)
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
         await wTaiko.send(embed);
         });
      });
   }
}