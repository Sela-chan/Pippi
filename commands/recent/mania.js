const { RichEmbed } = require('discord.js');
const bd = require('quick.db');
const request = require('request');
const deleteMsg = require('../../functions/deleteMsg');
const { pagesGeneral } = require('../../functions/pages');
// const wip = require('../../functions/wip');
const { osuE } = require('../../functions/emojis');
const { prefix, osu/*, owner*/ } = require('../../functions/settings');

module.exports = async (pippi, msg, args, mode) => {
   if (!args[1]) {
      let osuUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
      if (osuUser === null || osuUser === undefined) {
         deleteMsg(msg, 5000);
         msg.channel.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${pippi.user} mania -set <nombre de usuario>\` para definir tu nombre de usuario.*`)
            .then(m => deleteMsg(m, 5500));
         return;
      }
      let url = `https://osu.ppy.sh/api/get_user_recent?u=${osuUser}&k=${osu.key}&m=${mode}`;
      request(url,
      { json: true }, async (e, res, body) => {
         if (e) return;
         let i = 0;
         let page = 1;
         let info = res.body;
         if (info.length < 1) {
            deleteMsg(msg, 5000);
            msg.channel.send(`Parece que **${osuUser}** no tiene partidas recientes.`)
               .then(m => deleteMsg(m, 4500));
            return;
         }
         let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         request(url2,
         { json: true }, async (e2, res2, body2) => {
            if (e2) return;
            let i = 0;
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
            let info2 = res2.body[0];
            let bmID = info2.beatmapset_id;
            let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
${osuE.mhit300g}: \`${info[i].countgeki}\` ║ ${osuE.mhit300}: \`${info[i].count300}\` ║ ${osuE.mhit200}: \`${info[i].countkatu}\` ║ ${osuE.mhit100}: \`${info[i].count100}\` ║ ${osuE.mhit50}: \`${info[i].count50}\` ║ ${osuE.mhit0}: \`${info[i].countmiss}\`\n`;
            let pages = [];
            let imgs = [];
            pages.push(desc1);
            imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
            request(`https://osu.ppy.sh/api/get_user?u=${osuUser}&k=${osu.key}&m=${mode}`,
            { json: true }, async (e3, res3, body3) => {
               if (e3) return;
               let userInfo = res3.body[0];
               const embed = new RichEmbed()
                  .setAuthor(`Jugadas recientes en osu!Mania de ${userInfo.username}`, `https://osu.ppy.sh/images/flags/${userInfo.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${userInfo.user_id}/mania`)
                  .setThumbnail(`https://a.ppy.sh/${userInfo.user_id}`)
                  .setImage(imgs[page-1])
                  .setColor(msg.member.displayHexColor === '#000000' ? '#FF87B3' : msg.member.displayHexColor)
                  .setDescription(pages[page-1])
                  .setFooter(`Página ${page} de ${pages.length}`)
                  .setTimestamp();
               pagesGeneral(msg, embed, page, pages, imgs);
            });
         });
      });
      return;
   }
   let member = msg.mentions.members.first();
   if (!member) {
      let osuUser = args.slice(1).join(' ');
      let url = `https://osu.ppy.sh/api/get_user_recent?u=${osuUser}&k=${osu.key}&m=${mode}`;
      request(url,
      { json: true }, async (e, res, body) => {
         if (e) return;
         let i = 0;
         let page = 1;
         let info = res.body;
         if (info.length < 1) {
            deleteMsg(msg, 5000);
            msg.channel.send(`Parece que **${osuUser}** no tiene partidas recientes.`)
               .then(m => deleteMsg(m, 4500));
            return;
         }
         let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         request(url2,
         { json: true }, async (e2, res2, body2) => {
            if (e2) return;
            let i = 0;
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
            let info2 = res2.body[0];
            let bmID = info2.beatmapset_id;
            let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
${osuE.mhit300g}: \`${info[i].countgeki}\` ║ ${osuE.mhit300}: \`${info[i].count300}\` ║ ${osuE.mhit200}: \`${info[i].countkatu}\` ║ ${osuE.mhit100}: \`${info[i].count100}\` ║ ${osuE.mhit50}: \`${info[i].count50}\` ║ ${osuE.mhit0}: \`${info[i].countmiss}\`\n`;
            let pages = [];
            let imgs = [];
            pages.push(desc1);
            imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
            i = 1;
            let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         request(url2,
         { json: true }, async (e2, res2, body2) => {
            if (e2) return;
            let i = 1;
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
            let info2 = res2.body[0];
            let bmID = info2.beatmapset_id;
            let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
${osuE.mhit300g}: \`${info[i].countgeki}\` ║ ${osuE.mhit300}: \`${info[i].count300}\` ║ ${osuE.mhit200}: \`${info[i].countkatu}\` ║ ${osuE.mhit100}: \`${info[i].count100}\` ║ ${osuE.mhit50}: \`${info[i].count50}\` ║ ${osuE.mhit0}: \`${info[i].countmiss}\`\n`;
            pages.push(desc1);
            imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
            i = 2;
            let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         request(url2,
         { json: true }, async (e2, res2, body2) => {
            if (e2) return;
            let i = 2;
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
            let info2 = res2.body[0];
            let bmID = info2.beatmapset_id;
            let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
${osuE.mhit300g}: \`${info[i].countgeki}\` ║ ${osuE.mhit300}: \`${info[i].count300}\` ║ ${osuE.mhit200}: \`${info[i].countkatu}\` ║ ${osuE.mhit100}: \`${info[i].count100}\` ║ ${osuE.mhit50}: \`${info[i].count50}\` ║ ${osuE.mhit0}: \`${info[i].countmiss}\`\n`;
            pages.push(desc1);
            imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
            i = 3;
            let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         request(url2,
         { json: true }, async (e2, res2, body2) => {
            if (e2) return;
            let i = 3;
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
            let info2 = res2.body[0];
            let bmID = info2.beatmapset_id;
            let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
${osuE.mhit300g}: \`${info[i].countgeki}\` ║ ${osuE.mhit300}: \`${info[i].count300}\` ║ ${osuE.mhit200}: \`${info[i].countkatu}\` ║ ${osuE.mhit100}: \`${info[i].count100}\` ║ ${osuE.mhit50}: \`${info[i].count50}\` ║ ${osuE.mhit0}: \`${info[i].countmiss}\`\n`;
            pages.push(desc1);
            imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
            i = 4;
            let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         request(url2,
         { json: true }, async (e2, res2, body2) => {
            if (e2) return;
            let i = 4;
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
            let info2 = res2.body[0];
            let bmID = info2.beatmapset_id;
            let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
${osuE.mhit300g}: \`${info[i].countgeki}\` ║ ${osuE.mhit300}: \`${info[i].count300}\` ║ ${osuE.mhit200}: \`${info[i].countkatu}\` ║ ${osuE.mhit100}: \`${info[i].count100}\` ║ ${osuE.mhit50}: \`${info[i].count50}\` ║ ${osuE.mhit0}: \`${info[i].countmiss}\`\n`;
            pages.push(desc1);
            imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
            request(`https://osu.ppy.sh/api/get_user?u=${osuUser}&k=${osu.key}&m=${mode}`,
            { json: true }, async (e3, res3, body3) => {
               if (e3) return;
               let userInfo = res3.body[0];
               const embed = new RichEmbed()
                  .setAuthor(`Jugadas recientes en osu!Mania de ${userInfo.username}`, `https://osu.ppy.sh/images/flags/${userInfo.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${userInfo.user_id}/mania`)
                  .setThumbnail(`https://a.ppy.sh/${userInfo.user_id}`)
                  .setImage(imgs[page-1])
                  .setColor('#FF87B3')
                  .setDescription(pages[page-1])
                  .setFooter(`Página ${page} de ${pages.length}`)
                  .setTimestamp();
               pagesGeneral(msg, embed, page, pages, imgs);
            });
         });
         });
         });
         });
         });
      });
      return;
   }
   let osuUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
   if (osuUser === null || osuUser === undefined) {
      deleteMsg(msg, 5000);
      msg.channel.send(`Parece que ${member} no tiene definido ningún nombre de usuario.`)
         .then(m => deleteMsg(m, 5500));
      return;
   }
   let url = `https://osu.ppy.sh/api/get_user_recent?u=${osuUser}&k=${osu.key}&m=${mode}`;
   request(url,
   { json: true }, async (e, res, body) => {
         if (e) return;
         let i = 0;
         let page = 1;
         let info = res.body;
         if (info.length < 1) {
            deleteMsg(msg, 5000);
            msg.channel.send(`Parece que **${osuUser}** no tiene partidas recientes.`)
               .then(m => deleteMsg(m, 4500));
            return;
         }
         let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         request(url2,
         { json: true }, async (e2, res2, body2) => {
            if (e2) return;
            let i = 0;
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
            let info2 = res2.body[0];
            let bmID = info2.beatmapset_id;
            let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
${osuE.mhit300g}: \`${info[i].countgeki}\` ║ ${osuE.mhit300}: \`${info[i].count300}\` ║ ${osuE.mhit200}: \`${info[i].countkatu}\` ║ ${osuE.mhit100}: \`${info[i].count100}\` ║ ${osuE.mhit50}: \`${info[i].count50}\` ║ ${osuE.mhit0}: \`${info[i].countmiss}\`\n`;
            let pages = [];
            let imgs = [];
            pages.push(desc1);
            imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
            i = 1;
            let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         request(url2,
         { json: true }, async (e2, res2, body2) => {
            if (e2) return;
            let i = 1;
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
            let info2 = res2.body[0];
            let bmID = info2.beatmapset_id;
            let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
${osuE.mhit300g}: \`${info[i].countgeki}\` ║ ${osuE.mhit300}: \`${info[i].count300}\` ║ ${osuE.mhit200}: \`${info[i].countkatu}\` ║ ${osuE.mhit100}: \`${info[i].count100}\` ║ ${osuE.mhit50}: \`${info[i].count50}\` ║ ${osuE.mhit0}: \`${info[i].countmiss}\`\n`;
            pages.push(desc1);
            imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
            i = 2;
            let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         request(url2,
         { json: true }, async (e2, res2, body2) => {
            if (e2) return;
            let i = 2;
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
            let info2 = res2.body[0];
            let bmID = info2.beatmapset_id;
            let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
${osuE.mhit300g}: \`${info[i].countgeki}\` ║ ${osuE.mhit300}: \`${info[i].count300}\` ║ ${osuE.mhit200}: \`${info[i].countkatu}\` ║ ${osuE.mhit100}: \`${info[i].count100}\` ║ ${osuE.mhit50}: \`${info[i].count50}\` ║ ${osuE.mhit0}: \`${info[i].countmiss}\`\n`;
            pages.push(desc1);
            imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
            i = 3;
            let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         request(url2,
         { json: true }, async (e2, res2, body2) => {
            if (e2) return;
            let i = 3;
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
            let info2 = res2.body[0];
            let bmID = info2.beatmapset_id;
            let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
${osuE.mhit300g}: \`${info[i].countgeki}\` ║ ${osuE.mhit300}: \`${info[i].count300}\` ║ ${osuE.mhit200}: \`${info[i].countkatu}\` ║ ${osuE.mhit100}: \`${info[i].count100}\` ║ ${osuE.mhit50}: \`${info[i].count50}\` ║ ${osuE.mhit0}: \`${info[i].countmiss}\`\n`;
            pages.push(desc1);
            imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
            i = 4;
            let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         request(url2,
         { json: true }, async (e2, res2, body2) => {
            if (e2) return;
            let i = 4;
            let rankE = info[i].rank === 'XH' ? osuE.XH : 
            info[i].rank === 'SH' ? osuE.SH :
            info[i].rank === 'X' ? osuE.X :
            info[i].rank === 'S' ? osuE.S :
            info[i].rank === 'A' ? osuE.A :
            info[i].rank === 'B' ? osuE.B :
            info[i].rank === 'C' ? osuE.C :
            info[i].rank === 'F' ? osuE.D : '';
            let info2 = res2.body[0];
            let bmID = info2.beatmapset_id;
            let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
${osuE.mhit300g}: \`${info[i].countgeki}\` ║ ${osuE.mhit300}: \`${info[i].count300}\` ║ ${osuE.mhit200}: \`${info[i].countkatu}\` ║ ${osuE.mhit100}: \`${info[i].count100}\` ║ ${osuE.mhit50}: \`${info[i].count50}\` ║ ${osuE.mhit0}: \`${info[i].countmiss}\`\n`;
            pages.push(desc1);
            imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
            request(`https://osu.ppy.sh/api/get_user?u=${osuUser}&k=${osu.key}&m=${mode}`,
            { json: true }, async (e3, res3, body3) => {
               if (e3) return;
               let userInfo = res3.body[0];
               const embed = new RichEmbed()
                  .setAuthor(`Jugadas recientes en osu!Mania de ${userInfo.username}`, `https://osu.ppy.sh/images/flags/${userInfo.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${userInfo.user_id}/mania`)
                  .setThumbnail(`https://a.ppy.sh/${userInfo.user_id}`)
                  .setImage(imgs[page-1])
                  .setColor(member.displayHexColor === '#000000' ? '#FF87B3' : member.displayHexColor)
                  .setDescription(pages[page-1])
                  .setFooter(`Página ${page} de ${pages.length}`)
                  .setTimestamp();
               pagesGeneral(msg, embed, page, pages, imgs);
            });
         });
         });
         });
         });
         });
   });
}
