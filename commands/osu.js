const { RichEmbed } = require('discord.js');
const bd = require('quick.db');
const fs = require('fs');
const fetch = require('node-fetch');
const deleteMsg = require('../functions/deleteMsg');
const getRankEM = require('../functions/osuRanks');
const wip = require('../functions/wip');
const { osuE } = require('../functions/emojis');
const { prefix, osu, owner } = require('../functions/settings');
const { put } = require('../functions/misc');
module.exports = {
   name: "osu",
   aliases: ['std'],
   usage: `${prefix}osu [opciones] [búsqueda]`,
   category: "osu!",
   perms: [],
   description: `Información osu!Standard`,
   run: async (pippi, msg, args) => {
      bd.delete(`tempBMInfo`);
      bd.delete(`tempOsuInfo`);
      bd.delete(`tempImageBG`);
      bd.delete(`temp.osu`);
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
                  .addField('Nuevo nombre de usuario definido para <:osu:666406623232655370>', x.username)
                  .setTimestamp())
                  .then(m => deleteMsg(m, 5000));
            }).catch(() => msg.channel.send(`Parece que el nombre de usuario **${username}** no existe en <:osu:666406623232655370>\n*Asegúrate de haberlo escrito bien.*`)
               .then(m => deleteMsg(m, 5000)));
            return;
         }
         if (args[0] === '-top') {
            if (msg.author.id !== owner.id) return wip(msg);
            if (!args[1]) {
               let osuUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
               if (osuUser === null || osuUser === undefined) {
                  deleteMsg(msg, 6000);
                  msg.channel.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${prefix}osu -set <nombre de usuario>\` para definir tu nombre de usuario.*`)
                     .then(m => deleteMsg(m, 5500));
                  return;
               }
               let limit = 3;
               let url = `https://osu.ppy.sh/api/get_user_best?u=${osuUser}&k=${osu.key}&limit=${limit}&m=0`;
               fetch(url, { method: "Get" })
                  .then(r => r.json())
                  .then(async osuInfo => {
                     for (j = 0; j < osuInfo.length; j++) {
                        bd.push(`temp.osu.beatmap_id`, osuInfo[j].beatmap_id);
                        bd.push(`temp.osu.rank`, osuInfo[j].rank);
                        bd.push(`temp.osu.pp`, osuInfo[j].pp);
                        bd.push(`temp.osu.score`, osuInfo[j].score);
                        bd.push(`temp.osu.maxcombo`, osuInfo[j].maxcombo);
                        bd.push(`temp.osu.perfect`, osuInfo[j].perfect);
                        bd.push(`temp.osu.count300`, osuInfo[j].count300);
                        bd.push(`temp.osu.count100`, osuInfo[j].count100);
                        bd.push(`temp.osu.count50`, osuInfo[j].count50);
                        bd.push(`temp.osu.countmiss`, osuInfo[j].countmiss);
                     }
                  });
               let url2 = `https://osu.ppy.sh/api/get_user?u=${osuUser}&k=${osu.key}&m=0`;
               fetch(url2, { method: "Get" })
                  .then(r => r.json())
                  .then(userInfo => {
                     fs.writeFileSync("./commands/osu!/tempJSON/userInfo.json", `{\n   "osuUserArr": ${JSON.stringify(userInfo)
                        .replace(/{/g, '   {\n      ').replace(/},/g, '\n   },\n')
                        .replace(/",/g, '",\n      ').replace(/}]/g, '\n      }\n   ]')}\n}`);
                  });
               for (i = 0; i < limit; i++) {
                  let beatmap_id = await bd.get(`temp.osu.beatmap_id`);
                  let url3 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${beatmap_id[i]}&m=0`;
                  fetch(url3, { method: "Get" })
                  .then(r => r.json())
                  .then(async bmInfo => {
                     deleteMsg(msg);
                     let desc = '';
                     let rank = await bd.fetch(`temp.osu.rank`);
                     let pp = await bd.fetch(`temp.osu.pp`);
                     let score = await bd.fetch(`temp.osu.score`);
                     let maxcombo = await bd.fetch(`temp.osu.maxcombo`);
                     let perfect = await bd.fetch(`temp.osu.perfect`);
                     let count300 = await bd.fetch(`temp.osu.count300`);
                     let count100 = await bd.fetch(`temp.osu.count100`);
                     let count50 = await bd.fetch(`temp.osu.count50`);
                     let countmiss = await bd.fetch(`temp.osu.countmiss`);
                     // for (k = 0; k < osuInfoArr.length; k++) {
                     //    ranks.push(require(`./tempJSON/rank${k}.json`).rank);
                     //    pp.push(require(`./tempJSON/pp${k}.json`).pp);
                     //    score.push(require(`./tempJSON/score${k}.json`).score);
                     //    maxcombo.push(require(`./tempJSON/maxcombo${k}.json`).maxcombo);
                     //    perfect.push(require(`./tempJSON/perfect${k}.json`).perfect);
                     //    count300.push(require(`./tempJSON/count300${k}.json`).count300);
                     //    count100.push(require(`./tempJSON/count100${k}.json`).count100);
                     //    count50.push(require(`./tempJSON/count50${k}.json`).count50);
                     //    countmiss.push(require(`./tempJSON/countmiss${k}.json`).countmiss);
                     // }
                     let y = bmInfo[0];
                     bd.set(`tempImageBG`, y.beatmapset_id);
                     desc = desc + `**${i+1}.** **[${y.title}](https://osu.ppy.sh/beatmapsets/${y.beatmapset_id}#osu/${y.beatmap_id})** by [${y.creator}](https://osu.ppy.sh/users/${y.creator_id}) [${y.version}]
   • Dificultad: ${'⭐'.repeat(Math.floor(y.difficultyrating))}
   • Obtuviste ${getRankEM(rank[i])}
   • Mods: *Trabajando en ello*
   • PP: ${(Math.round(pp[i] * 100) / 100).toFixed(2)} | Acc: *Trabajando en ello*
   • Puntuación: ${score[i]} | Combo: **${maxcombo[i]}**x / **${y.max_combo}**x -> ${perfect[i] == 1 ? '**FC!**' : 'No FC T-T'}
   | ${osuE.hit300}: ${count300[i]} | ${osuE.hit100}: ${count100[i]} | ${osuE.hit50}: ${count50[i]} | ${osuE.hit0}: ${countmiss[i]} |\n\n`;
                     await bd.set(`tempBMInfo`, desc);
                  });
               }
               let info = await bd.fetch(`tempBMInfo`);
               let z = await require('./tempJSON/userInfo.json').osuUserArr[0];
               const embed = new RichEmbed()
                  .setAuthor(`Mejores rendimientos en osu!STD de ${z.username}`, `https://osu.ppy.sh/images/flags/${z.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${z.user_id}/osu`)
                  .setColor(msg.member.displayHexColor === '#000000' ? put.turquoise : msg.member.displayHexColor)
                  .setThumbnail(`https://b.ppy.sh/thumb/${bd.get(`tempImageBG`)}l.jpg`)
                  .setDescription(info)
                  .setTimestamp();
               msg.channel.send(embed);
               return;
            }
            return;
         }
         if (!args[0]) {
            let osuUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
            if (osuUser === null || osuUser === undefined) {
               deleteMsg(msg, 6000);
               msg.channel.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${prefix}osu -set <nombre de usuario>\` para definir tu nombre de usuario.*`)
                  .then(m => deleteMsg(m, 5500));
               return;
            }
            let url = `https://osu.ppy.sh/api/get_user?u=${osuUser}&k=${osu.key}`;
            fetch(url, { method: "Get" })
               .then(r => r.json())
               .then(osuInfo => {
                  let x = osuInfo[0];
                  deleteMsg(msg);
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
         let member = msg.mentions.members.first();
         if (!member) {
            let username = args.slice(0).join(' ');
            let url = `https://osu.ppy.sh/api/get_user?u=${username}&k=${osu.key}`;
            fetch(url, { method: "Get" })
               .then(r => r.json())
               .then(osuInfo => {
                  let x = osuInfo[0];
                  deleteMsg(msg);
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
               }).catch(() => msg.channel.send(`No he podido encontrar a **${username}** en <:osu:666406623232655370>`)
                                 .then(m => deleteMsg(m, 5000)));
            return;
         }
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
               deleteMsg(msg);
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
         if (!args[1]) {
            deleteMsg(msg, 5000);
            msg.channel.send('Debes escribir el nombre de usuario que deseas predeterminar.')
               .then(m => deleteMsg(m, 4500));
            return;
         }
         deleteMsg(msg);
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
         let osuUser = await bd.fetch(`ripple.ripple.${msg.author.id}.username`);
         if (osuUser === null || osuUser === undefined) {
            deleteMsg(msg, 6000);
            msg.channel.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${prefix}osu -set <nombre de usuario> -ripple\` para definir tu nombre de usuario.*`)
               .then(m => deleteMsg(m, 5500));
            return;
         }
         let url = `http://ripple.moe/api/get_user?u=${osuUser}&m=0`;
         fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(osuInfo => {
               let x = osuInfo[0];
               deleteMsg(msg);
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
      let member = msg.mentions.members.first();
      if (!member) {
         let username = args.slice(0).join(' ');
         let url = `http://ripple.moe/api/get_user?u=${username}&m=0`;
         fetch(url, { method: "Get" })
            .then(r => r.json())
            .then(osuInfo => {
               let x = osuInfo[0];
               deleteMsg(msg);
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
            deleteMsg(msg);
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
