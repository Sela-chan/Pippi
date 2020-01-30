const { RichEmbed } = require('discord.js');
const bd = require('quick.db');
const nosu = require('node-osu');
const deleteMsg = require('../../functions/deleteMsg');
const { pagesGeneral } = require('../../functions/pages');
const { osuE } = require('../../functions/emojis');
const { osu } = require('../../functions/settings');
const osuApi = new nosu.Api(osu.key, { completeScores: true, notFoundAsError: true });

module.exports = async (pippi, msg, args, mode) => {
   if (!args[1]) {
      return msg.channel.send('Debes especificar un nombre de usuario de osu!')
      .then(m => deleteMsg(m, 5000));
      var osuUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
      if (osuUser === null || osuUser === undefined) {
         deleteMsg(msg, 5000);
         msg.channel.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${pippi.user} osu -set <nombre de usuario>\` para definir tu nombre de usuario.*`)
            .then(m => deleteMsg(m, 5500));
         return;
      }
      osuApi.getUser({ u: osuUser })
      .then(async user => await bd.set('user', { username: user.name, user_id: user.id, country: user.country }));
      osuApi.getUserBest({ u: osuUser, m: mode, limit: 20 }).then(async info => {
         var page = 1;
         var pages = [];
         var imgs = [];
         if (info.length<20) var limit = info.length;
         else var limit = 20;
         for (i = 0; i < limit; i++) {
         var rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
         var info2 = info[i].beatmap;
         osuApi.getUser({ u: info2.creator })
         .then(async creator => await bd.set('creator', creator.id));
         var desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapSetId}#osu/${info2.id})**`+
         ` by [${info2.creator}](https://osu.ppy.sh/users/${creator.id}) [${info2.version}]`+
         `\n• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficulty.rating))+
` \`(${(Math.round(info2.difficulty.rating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• ${info[i].pp === null ? 'No PP :c' : `PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)}`} ║ Acc: ${(Math.round(info[i].accuracy * 10000) / 100).toFixed(2)}%
• Puntuación: ${info[i].score} | Combo: **${info[i].maxCombo}**x / **${info2.maxCombo}**x -> ${info[i].perfect == true ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].counts['300']}\` ║ ${osuE.hit100}: \`${info[i].counts['100']}\` ║ ${osuE.hit50}: \`${info[i].counts['50']}\` ║ ${osuE.hit0}: \`${info[i].counts.miss}\` ║\n`;
         pages.push(desc);
         imgs.push(`https://b.ppy.sh/thumb/${info2.beatmapSetId}l.jpg`);
         }
         const embed = new RichEmbed()
            .setAuthor(`Mejores rendimientos en osu!STD de ${bd.get('user').username}`, `https://osu.ppy.sh/images/flags/${bd.get('user').country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${bd.get('user').user_id}/osu`)
            .setThumbnail(`https://a.ppy.sh/${bd.get('user').user_id}`)
            .setImage(imgs[page-1])
            .setColor(msg.member.displayHexColor === '#000000' ? '#FF87B3' : msg.member.displayHexColor)
            .setDescription(pages[page-1])
            .setFooter(`Página ${page} de ${pages.length}`)
            .setTimestamp();
         pagesGeneral(msg, embed, page, pages, imgs);
      });
      return;
   }
   var member = msg.mentions.members.filter(m => m.id !== pippi.user.id).first();
   if (!member) {
      var osuUser = args.slice(1).join(' ');
      osuApi.getUser({ u: osuUser })
      .then(async user => await bd.set('user', { username: user.name, user_id: user.id, country: user.country }));
      osuApi.getUserBest({ u: osuUser, m: mode, limit: 20 }).then(async info => {
         var page = 1;
         var pages = [];
         var imgs = [];
         if (info.length<20) var limit = info.length;
         else var limit = 20;
         for (i = 0; i < limit; i++) {
         var rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
         var info2 = info[i].beatmap;
         osuApi.getUser({ u: info2.creator })
         .then(async creator => {await bd.set('creator', creator.id)});
         var desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapSetId}#osu/${info2.id})**`+
         ` by [${info2.creator}](https://osu.ppy.sh/users/${bd.get('creator')}) [${info2.version}]`+
         `\n• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficulty.rating))+
` \`(${(Math.round(info2.difficulty.rating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• ${info[i].pp === null ? 'No PP :c' : `PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)}`} ║ Acc: ${(Math.round(info[i].accuracy * 10000) / 100).toFixed(2)}%
• Puntuación: ${info[i].score} | Combo: **${info[i].maxCombo}**x / **${info2.maxCombo}**x -> ${info[i].perfect == true ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].counts['300']}\` ║ ${osuE.hit100}: \`${info[i].counts['100']}\` ║ ${osuE.hit50}: \`${info[i].counts['50']}\` ║ ${osuE.hit0}: \`${info[i].counts.miss}\` ║\n`;
         pages.push(desc);
         imgs.push(`https://b.ppy.sh/thumb/${info2.beatmapSetId}l.jpg`);
         }
         const embed = new RichEmbed()
            .setAuthor(`Mejores rendimientos en osu!STD de ${bd.get('user').username}`, `https://osu.ppy.sh/images/flags/${bd.get('user').country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${bd.get('user').user_id}/osu`)
            .setThumbnail(`https://a.ppy.sh/${bd.get('user').user_id}`)
            .setImage(imgs[page-1])
            .setColor('#FF87B3')
            .setDescription(pages[page-1])
            .setFooter(`Página ${page} de ${pages.length}`)
            .setTimestamp();
         pagesGeneral(msg, embed, page, pages, imgs);
      }).catch(() => msg.channel.send(`No he podido encontrar a **${osuUser}** en <:EBosu:666406623232655370>`)
      .then(m => deleteMsg(m, 5000)));
      return;
   }
   return msg.channel.send('Debes especificar un nombre de usuario de osu!')
   .then(m => deleteMsg(m, 5000));
   var osuUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
   if (osuUser === null || osuUser === undefined) {
      deleteMsg(msg, 5000);
      msg.channel.send(`Parece que ${member} no tiene definido ningún nombre de usuario.`)
         .then(m => deleteMsg(m, 5500));
      return;
   }
   osuApi.getUser({ u: osuUser })
   .then(async user => await bd.set('user', { username: user.name, user_id: user.id, country: user.country }));
   osuApi.getUserBest({ u: osuUser, m: mode, limit: 20 }).then(async info => {
      var page = 1;
      var pages = [];
      var imgs = [];
      if (info.length<20) var limit = info.length;
         else var limit = 20;
      for (i = 0; i < limit; i++) {
      var rankE = info[i].rank === 'XH' ? osuE.XH : 
         info[i].rank === 'SH' ? osuE.SH :
         info[i].rank === 'X' ? osuE.X :
         info[i].rank === 'S' ? osuE.S :
         info[i].rank === 'A' ? osuE.A :
         info[i].rank === 'B' ? osuE.B :
         info[i].rank === 'C' ? osuE.C :
         info[i].rank === 'F' ? osuE.D : '';
      var info2 = info[i].beatmap;
      osuApi.getUser({ u: info2.creator })
      .then(async creator => await bd.set('creator', creator.id));
      var desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapSetId}#osu/${info2.id})**`+
      ` by [${info2.creator}](https://osu.ppy.sh/users/${creator.id}) [${info2.version}]`+
      `\n• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficulty.rating))+
` \`(${(Math.round(info2.difficulty.rating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• ${info[i].pp === null ? 'No PP :c' : `PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)}`} ║ Acc: ${(Math.round(info[i].accuracy * 10000) / 100).toFixed(2)}%
• Puntuación: ${info[i].score} | Combo: **${info[i].maxCombo}**x / **${info2.maxCombo}**x -> ${info[i].perfect == true ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].counts['300']}\` ║ ${osuE.hit100}: \`${info[i].counts['100']}\` ║ ${osuE.hit50}: \`${info[i].counts['50']}\` ║ ${osuE.hit0}: \`${info[i].counts.miss}\` ║\n`;
      pages.push(desc);
      imgs.push(`https://b.ppy.sh/thumb/${info2.beatmapSetId}l.jpg`);
      }
      const embed = new RichEmbed()
         .setAuthor(`Mejores rendimientos en osu!STD de ${bd.get('user').username}`, `https://osu.ppy.sh/images/flags/${bd.get('user').country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${bd.get('user').user_id}/osu`)
         .setThumbnail(`https://a.ppy.sh/${bd.get('user').user_id}`)
         .setImage(imgs[page-1])
         .setColor(member.displayHexColor === '#000000' ? '#FF87B3' : member.displayHexColor)
         .setDescription(pages[page-1])
         .setFooter(`Página ${page} de ${pages.length}`)
         .setTimestamp();
      pagesGeneral(msg, embed, page, pages, imgs);
   });
}