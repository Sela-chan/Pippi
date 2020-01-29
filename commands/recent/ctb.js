const { RichEmbed } = require('discord.js');
const bd = require('quick.db');
const nosu = require('node-osu');
const deleteMsg = require('../../functions/deleteMsg');
const { pagesGeneral } = require('../../functions/pages');
const { osuE } = require('../../functions/emojis');
const { osu } = require('../../functions/settings');
const osuApi = new nosu.Api(osu.key, { completeScores: true, notFoundAsError: true });

module.exports = async (pippi, msg, wCTB, args, mode) => {
   if (args[args.length-1] !== '-first') {
      wCTB = msg.channel;
   if (!args[1]) {
      return wTaiko.send('Debes especificar un nombre de usuario de osu!')
      .then(m => deleteMsg(m, 5000));
      let osuUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
      if (osuUser === null || osuUser === undefined) {
         deleteMsg(msg, 5000);
         msg.channel.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${pippi.user} osu -set <nombre de usuario>\` para definir tu nombre de usuario.*`)
            .then(m => deleteMsg(m, 5500));
         return;
      }
      osuApi.getUser({ u: osuUser })
      .then(async user => await bd.set('user', { username: user.name, user_id: user.id, country: user.country }));
      osuApi.getUserRecent({ u: osuUser, m: mode, limit: 10 }).then(async info => {
         let page = 1;
         let pages = [];
         let imgs = [];
         if (info.length<10) var limit = info.length;
         else var limit = 10;
         for (i = 0; i < limit; i++) {
         let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
         let info2 = info[i].beatmap;
         osuApi.getUser({ u: info2.creator })
         .then(async creator => await bd.set('creator', creator.id));
         let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapSetId}#osu/${info2.id})**`+
         ` by [${info2.creator}](https://osu.ppy.sh/users/${bd.get('creator')}) [${info2.version}]`+
         `\n• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficulty.rating))+
` \`(${(Math.round(info2.difficulty.rating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• ${info[i].pp === null ? 'No PP :c' : `PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)}`} ║ Acc: ${(Math.round(info[i].accuracy * 10000) / 100).toFixed(2)}%
• Puntuación: ${info[i].score} | Combo: **${info[i].maxCombo}**x / **${info2.maxCombo}**x -> ${info[i].perfect == true ? '**FC!**' : 'No FC T-T'}
║ ${osuE.fruit}: \`${info[i].counts['300']}\` ║ ${osuE.fdrop}: \`${info[i].counts['100']}\` ║ ${osuE.fminidrop}: \`${info[i].counts['50']}\` ║ ${osuE.fmiss}: \`${info[i].counts.miss}\` ║\n`;
         pages.push(desc);
         imgs.push(`https://b.ppy.sh/thumb/${info2.beatmapSetId}l.jpg`);
         }
         const embed = new RichEmbed()
            .setAuthor(`Jugadas recientes en osu!CatchTheBeat de ${bd.get('user').username}`, `https://osu.ppy.sh/images/flags/${bd.get('user').country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${bd.get('user').user_id}/fruits`)
            .setThumbnail(`https://a.ppy.sh/${bd.get('user').user_id}`)
            .setImage(imgs[page-1])
            .setColor(msg.member.displayHexColor === '#000000' ? '#FF87B3' : msg.member.displayHexColor)
            .setDescription(pages[page-1])
            .setFooter(`Página ${page} de ${pages.length}`)
            .setTimestamp();
         pagesGeneral(msg, embed, page, pages, imgs);
      }).catch(() => msg.channel.send(`Parece que **${osuUser}** no tiene partidas recientes en <:EBosu:666406623232655370>`)
      .then(m => deleteMsg(m, 5000)));
      return;
   }
   let member = msg.mentions.members.filter(m => m.id !== pippi.user.id).first();
   if (!member) {
      let osuUser = args.slice(1).join(' ');
      osuApi.getUser({ u: osuUser })
      .then(async user => await bd.set('user', { username: user.name, user_id: user.id, country: user.country }));
      osuApi.getUserRecent({ u: osuUser, m: mode, limit: 10 }).then(async info => {
         let page = 1;
         let pages = [];
         let imgs = [];
         if (info.length<10) var limit = info.length;
         else var limit = 10;
         for (i = 0; i < limit; i++) {
         let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
         let info2 = info[i].beatmap;
         osuApi.getUser({ u: info2.creator })
         .then(async creator => await bd.set('creator', creator.id));
         let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapSetId}#osu/${info2.id})**`+
         ` by [${info2.creator}](https://osu.ppy.sh/users/${bd.get('creator')}) [${info2.version}]`+
         `\n• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficulty.rating))+
` \`(${(Math.round(info2.difficulty.rating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• ${info[i].pp === null ? 'No PP :c' : `PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)}`} ║ Acc: ${(Math.round(info[i].accuracy * 10000) / 100).toFixed(2)}%
• Puntuación: ${info[i].score} | Combo: **${info[i].maxCombo}**x / **${info2.maxCombo}**x -> ${info[i].perfect == true ? '**FC!**' : 'No FC T-T'}
║ ${osuE.fruit}: \`${info[i].counts['300']}\` ║ ${osuE.fdrop}: \`${info[i].counts['100']}\` ║ ${osuE.fminidrop}: \`${info[i].counts['50']}\` ║ ${osuE.fmiss}: \`${info[i].counts.miss}\` ║\n`;
         pages.push(desc);
         imgs.push(`https://b.ppy.sh/thumb/${info2.beatmapSetId}l.jpg`);
         }
         const embed = new RichEmbed()
            .setAuthor(`Jugadas recientes en osu!CatchTheBeat de ${bd.get('user').username}`, `https://osu.ppy.sh/images/flags/${bd.get('user').country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${bd.get('user').user_id}/fruits`)
            .setThumbnail(`https://a.ppy.sh/${bd.get('user').user_id}`)
            .setImage(imgs[page-1])
            .setColor('#FF87B3')
            .setDescription(pages[page-1])
            .setFooter(`Página ${page} de ${pages.length}`)
            .setTimestamp();
         pagesGeneral(msg, embed, page, pages, imgs);
      }).catch(() => msg.channel.send(`Parece que **${osuUser}** no tiene partidas recientes en <:EBosu:666406623232655370>`)
      .then(m => deleteMsg(m, 5000)));
      return;
   }
   return wTaiko.send('Debes especificar un nombre de usuario de osu!')
   .then(m => deleteMsg(m, 5000));
   let osuUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
   if (osuUser === null || osuUser === undefined) {
      deleteMsg(msg, 5000);
      msg.channel.send(`Parece que ${member} no tiene definido ningún nombre de usuario.`)
         .then(m => deleteMsg(m, 5500));
      return;
   }
   osuApi.getUser({ u: osuUser })
   .then(async user => await bd.set('user', { username: user.name, user_id: user.id, country: user.country }));
   osuApi.getUserRecent({ u: osuUser, m: mode, limit: 10 }).then(async info => {
      let page = 1;
      let pages = [];
      let imgs = [];
      if (info.length<10) var limit = info.length;
         else var limit = 10;
      for (i = 0; i < limit; i++) {
      let rankE = info[i].rank === 'XH' ? osuE.XH : 
         info[i].rank === 'SH' ? osuE.SH :
         info[i].rank === 'X' ? osuE.X :
         info[i].rank === 'S' ? osuE.S :
         info[i].rank === 'A' ? osuE.A :
         info[i].rank === 'B' ? osuE.B :
         info[i].rank === 'C' ? osuE.C :
         info[i].rank === 'F' ? osuE.D : '';
      let info2 = info[i].beatmap;
      osuApi.getUser({ u: info2.creator })
      .then(async creator => await bd.set('creator', creator.id));
      let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapSetId}#osu/${info2.id})**`+
      ` by [${info2.creator}](https://osu.ppy.sh/users/${bd.get('creator')}) [${info2.version}]`+
      `\n• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficulty.rating))+
` \`(${(Math.round(info2.difficulty.rating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• ${info[i].pp === null ? 'No PP :c' : `PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)}`} ║ Acc: ${(Math.round(info[i].accuracy * 10000) / 100).toFixed(2)}%
• Puntuación: ${info[i].score} | Combo: **${info[i].maxCombo}**x / **${info2.maxCombo}**x -> ${info[i].perfect == true ? '**FC!**' : 'No FC T-T'}
║ ${osuE.fruit}: \`${info[i].counts['300']}\` ║ ${osuE.fdrop}: \`${info[i].counts['100']}\` ║ ${osuE.fminidrop}: \`${info[i].counts['50']}\` ║ ${osuE.fmiss}: \`${info[i].counts.miss}\` ║\n`;
      pages.push(desc);
      imgs.push(`https://b.ppy.sh/thumb/${info2.beatmapSetId}l.jpg`);
      }
      const embed = new RichEmbed()
         .setAuthor(`Jugadas recientes en osu!CatchTheBeat de ${bd.get('user').username}`, `https://osu.ppy.sh/images/flags/${bd.get('user').country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${bd.get('user').user_id}/fruits`)
         .setThumbnail(`https://a.ppy.sh/${bd.get('user').user_id}`)
         .setImage(imgs[page-1])
         .setColor(member.displayHexColor === '#000000' ? '#FF87B3' : member.displayHexColor)
         .setDescription(pages[page-1])
         .setFooter(`Página ${page} de ${pages.length}`)
         .setTimestamp();
      pagesGeneral(msg, embed, page, pages, imgs);
   }).catch(() => msg.channel.send(`Parece que **${osuUser}** no tiene partidas recientes en <:EBosu:666406623232655370>`)
   .then(m => deleteMsg(m, 5000)));
   return;
   } else {
      args.splice(args.length-1, 1);
      if (!args[1]) {
         return wTaiko.send('Debes especificar un nombre de usuario de osu!')
         .then(m => deleteMsg(m, 5000));
         let osuUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
         if (osuUser === null || osuUser === undefined) {
            deleteMsg(msg, 5000);
            msg.channel.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${pippi.user} osu -set <nombre de usuario>\` para definir tu nombre de usuario.*`)
               .then(m => deleteMsg(m, 5500));
            return;
         }
         osuApi.getUser({ u: osuUser })
         .then(async user => await bd.set('user', { username: user.name, user_id: user.id, country: user.country }));
         osuApi.getUserRecent({ u: osuUser, m: mode, limit: 10 }).then(async info => {
            let page = 1;
            let pages = [];
            let imgs = [];
            if (info.length<10) var limit = info.length;
            else var limit = 10;
            for (i = 0; i < limit; i++) {
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
               info[i].rank === 'SH' ? osuE.SH :
               info[i].rank === 'X' ? osuE.X :
               info[i].rank === 'S' ? osuE.S :
               info[i].rank === 'A' ? osuE.A :
               info[i].rank === 'B' ? osuE.B :
               info[i].rank === 'C' ? osuE.C :
               info[i].rank === 'F' ? osuE.D : '';
            let info2 = info[i].beatmap;
            osuApi.getUser({ u: info2.creator })
            .then(async creator => await bd.set('creator', creator.id));
            let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapSetId}#osu/${info2.id})**`+
            ` by [${info2.creator}](https://osu.ppy.sh/users/${bd.get('creator')}) [${info2.version}]`+
            `\n• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficulty.rating))+
   ` \`(${(Math.round(info2.difficulty.rating * 100) / 100).toFixed(2)}*)\``}
   • Obtuviste ${rankE}
   • Mods: *Trabajando en ello*
   • ${info[i].pp === null ? 'No PP :c' : `PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)}`} ║ Acc: ${(Math.round(info[i].accuracy * 10000) / 100).toFixed(2)}%
   • Puntuación: ${info[i].score} | Combo: **${info[i].maxCombo}**x / **${info2.maxCombo}**x -> ${info[i].perfect == true ? '**FC!**' : 'No FC T-T'}
   ║ ${osuE.fruit}: \`${info[i].counts['300']}\` ║ ${osuE.fdrop}: \`${info[i].counts['100']}\` ║ ${osuE.fminidrop}: \`${info[i].counts['50']}\` ║ ${osuE.fmiss}: \`${info[i].counts.miss}\` ║\n`;
            pages.push(desc);
            imgs.push(`https://b.ppy.sh/thumb/${info2.beatmapSetId}l.jpg`);
            }
            const embed = new RichEmbed()
               .setAuthor(`Jugadas recientes en osu!CatchTheBeat de ${bd.get('user').username}`, `https://osu.ppy.sh/images/flags/${bd.get('user').country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${bd.get('user').user_id}/fruits`)
               .setThumbnail(`https://a.ppy.sh/${bd.get('user').user_id}`)
               .setImage(imgs[page-1])
               .setColor(msg.member.displayHexColor === '#000000' ? '#FF87B3' : msg.member.displayHexColor)
               .setDescription(pages[page-1])
               .setFooter(`Página ${page} de ${pages.length}`)
               .setTimestamp();
            pagesGeneral(msg, embed, page, pages, imgs);
         }).catch(() => msg.channel.send(`Parece que **${osuUser}** no tiene partidas recientes en <:EBosu:666406623232655370>`)
         .then(m => deleteMsg(m, 5000)));
         return;
      }
      let member = msg.mentions.members.filter(m => m.id !== pippi.user.id).first();
      if (!member) {
         let osuUser = args.slice(1).join(' ');
         osuApi.getUser({ u: osuUser })
         .then(async user => await bd.set('user', { username: user.name, user_id: user.id, country: user.country }));
         osuApi.getUserRecent({ u: osuUser, m: mode, limit: 10 }).then(async info => {
            let page = 1;
            let pages = [];
            let imgs = [];
            if (info.length<10) var limit = info.length;
            else var limit = 10;
            for (i = 0; i < limit; i++) {
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
               info[i].rank === 'SH' ? osuE.SH :
               info[i].rank === 'X' ? osuE.X :
               info[i].rank === 'S' ? osuE.S :
               info[i].rank === 'A' ? osuE.A :
               info[i].rank === 'B' ? osuE.B :
               info[i].rank === 'C' ? osuE.C :
               info[i].rank === 'F' ? osuE.D : '';
            let info2 = info[i].beatmap;
            osuApi.getUser({ u: info2.creator })
            .then(async creator => await bd.set('creator', creator.id));
            let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapSetId}#osu/${info2.id})**`+
            ` by [${info2.creator}](https://osu.ppy.sh/users/${bd.get('creator')}) [${info2.version}]`+
            `\n• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficulty.rating))+
   ` \`(${(Math.round(info2.difficulty.rating * 100) / 100).toFixed(2)}*)\``}
   • Obtuviste ${rankE}
   • Mods: *Trabajando en ello*
   • ${info[i].pp === null ? 'No PP :c' : `PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)}`} ║ Acc: ${(Math.round(info[i].accuracy * 10000) / 100).toFixed(2)}%
   • Puntuación: ${info[i].score} | Combo: **${info[i].maxCombo}**x / **${info2.maxCombo}**x -> ${info[i].perfect == true ? '**FC!**' : 'No FC T-T'}
   ║ ${osuE.fruit}: \`${info[i].counts['300']}\` ║ ${osuE.fdrop}: \`${info[i].counts['100']}\` ║ ${osuE.fminidrop}: \`${info[i].counts['50']}\` ║ ${osuE.fmiss}: \`${info[i].counts.miss}\` ║\n`;
            pages.push(desc);
            imgs.push(`https://b.ppy.sh/thumb/${info2.beatmapSetId}l.jpg`);
            }
            const embed = new RichEmbed()
               .setAuthor(`Jugadas recientes en osu!CatchTheBeat de ${bd.get('user').username}`, `https://osu.ppy.sh/images/flags/${bd.get('user').country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${bd.get('user').user_id}/fruits`)
               .setThumbnail(`https://a.ppy.sh/${bd.get('user').user_id}`)
               .setImage(imgs[page-1])
               .setColor('#FF87B3')
               .setDescription(pages[page-1])
               .setFooter(`Página ${page} de ${pages.length}`)
               .setTimestamp();
            pagesGeneral(msg, embed, page, pages, imgs);
         }).catch(() => msg.channel.send(`Parece que **${osuUser}** no tiene partidas recientes en <:EBosu:666406623232655370>`)
         .then(m => deleteMsg(m, 5000)));
         return;
      }
      return wTaiko.send('Debes especificar un nombre de usuario de osu!')
      .then(m => deleteMsg(m, 5000));
      let osuUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
      if (osuUser === null || osuUser === undefined) {
         deleteMsg(msg, 5000);
         msg.channel.send(`Parece que ${member} no tiene definido ningún nombre de usuario.`)
            .then(m => deleteMsg(m, 5500));
         return;
      }
      osuApi.getUser({ u: osuUser })
      .then(async user => await bd.set('user', { username: user.name, user_id: user.id, country: user.country }));
      osuApi.getUserRecent({ u: osuUser, m: mode, limit: 10 }).then(async info => {
         let page = 1;
         let pages = [];
         let imgs = [];
         if (info.length<10) var limit = info.length;
            else var limit = 10;
         for (i = 0; i < limit; i++) {
         let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
         let info2 = info[i].beatmap;
         osuApi.getUser({ u: info2.creator })
         .then(async creator => await bd.set('creator', creator.id));
         let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapSetId}#osu/${info2.id})**`+
         ` by [${info2.creator}](https://osu.ppy.sh/users/${bd.get('creator')}) [${info2.version}]`+
         `\n• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficulty.rating))+
   ` \`(${(Math.round(info2.difficulty.rating * 100) / 100).toFixed(2)}*)\``}
   • Obtuviste ${rankE}
   • Mods: *Trabajando en ello*
   • ${info[i].pp === null ? 'No PP :c' : `PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)}`} ║ Acc: ${(Math.round(info[i].accuracy * 10000) / 100).toFixed(2)}%
   • Puntuación: ${info[i].score} | Combo: **${info[i].maxCombo}**x / **${info2.maxCombo}**x -> ${info[i].perfect == true ? '**FC!**' : 'No FC T-T'}
   ║ ${osuE.fruit}: \`${info[i].counts['300']}\` ║ ${osuE.fdrop}: \`${info[i].counts['100']}\` ║ ${osuE.fminidrop}: \`${info[i].counts['50']}\` ║ ${osuE.fmiss}: \`${info[i].counts.miss}\` ║\n`;
         pages.push(desc);
         imgs.push(`https://b.ppy.sh/thumb/${info2.beatmapSetId}l.jpg`);
         }
         const embed = new RichEmbed()
            .setAuthor(`Jugadas recientes en osu!CatchTheBeat de ${bd.get('user').username}`, `https://osu.ppy.sh/images/flags/${bd.get('user').country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${bd.get('user').user_id}/fruits`)
            .setThumbnail(`https://a.ppy.sh/${bd.get('user').user_id}`)
            .setImage(imgs[page-1])
            .setColor(member.displayHexColor === '#000000' ? '#FF87B3' : member.displayHexColor)
            .setDescription(pages[page-1])
            .setFooter(`Página ${page} de ${pages.length}`)
            .setTimestamp();
         pagesGeneral(msg, embed, page, pages, imgs);
      }).catch(() => msg.channel.send(`Parece que **${osuUser}** no tiene partidas recientes en <:EBosu:666406623232655370>`)
      .then(m => deleteMsg(m, 5000)));
   }
}