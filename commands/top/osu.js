const { RichEmbed } = require('discord.js');
const bd = require('quick.db');
const request = require('request');
const deleteMsg = require('../../functions/deleteMsg');
const { pagesGeneral } = require('../../functions/pages');
// const wip = require('../../functions/wip');
const { osuE } = require('../../functions/emojis');
const { prefix, osu/*, owner*/ } = require('../../functions/settings');

module.exports = async (pippi, msg, args, mode) => {
   // if (msg.author.id !== owner.id) return wip(msg);
   if (!args[1]) {
      let osuUser = await bd.fetch(`osu.osu.${msg.author.id}.username`);
      if (osuUser === null || osuUser === undefined) {
         deleteMsg(msg, 6000);
         msg.channel.send(`No tienes definido ningún nombre de usuario.\n*Usa \`${pippi.user} osu -set <nombre de usuario>\` para definir tu nombre de usuario.*`)
            .then(m => deleteMsg(m, 5500));
         return;
      }
      deleteMsg(msg);
      let limit = 10;
      let url = `https://osu.ppy.sh/api/get_user_best?u=${osuUser}&` +
      `k=${osu.key}&limit=${limit}&m=${mode}`;
      request(url,
      { json: true }, async (e, res, body) => {
               if (e) return;
               let i = 0;
               let page = 1;
               let info = res.body;
               let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                  if (e2) return;
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
                  i = 0;
                  let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                  
                  let pages = [];
                  let imgs = [];
                  pages.push(desc1);
                  imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                  i = 1;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     i = 1;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     
                     pages.push(desc);
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 2;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     i = 2;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     
                     pages.push(desc);
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 3;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     i = 3;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     
                     pages.push(desc);
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 4;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 4;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     pages.push(desc);
                     i = 5;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 5;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     pages.push(desc);
                     i = 6;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 6;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     pages.push(desc);
                     i = 7;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 7;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     pages.push(desc);
                     i = 8;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 8;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     pages.push(desc);
                     i = 9;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 9;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     request(`https://osu.ppy.sh/api/get_user?u=${osuUser}&k=${osu.key}&m=${mode}`,
                     { json: true }, async (e3, res3, body3) => {
                        if (e3) return;
                        let userInfo = res3.body[0];
                        pages.push(desc);
                        const embed = new RichEmbed()
                           .setAuthor(`Mejores rendimientos en osu!STD de ${userInfo.username}`, `https://osu.ppy.sh/images/flags/${userInfo.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${userInfo.user_id}/osu`)
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
               });
               });
               });
               });
               });
               });
               });
               });
      });
      return;
   }
   let member = msg.mentions.members.first();
   if (!member) {
      let osuUser = args.slice(1).join(' ');
      let limit = 10;
      let url = `https://osu.ppy.sh/api/get_user_best?u=${osuUser}&` +
      `k=${osu.key}&limit=${limit}&m=${mode}`;
      request(url,
      { json: true }, async (e, res, body) => {
               if (e) return;
               let i = 0;
               let page = 1;
               let info = res.body;
               if (info.length < 1) {
                  deleteMsg(msg, 5000);
                  msg.channel.send(`Parece que **${osuUser}** no existe en <:EBosu:666406623232655370>.`)
                     .then(m => deleteMsg(m, 4500));
                  return;
               }
               deleteMsg(msg);
               let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                  if (e2) return;
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
                  i = 0;
                  let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                  ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                  
                  let pages = [];
                  let imgs = [];
                  pages.push(desc1);
                  imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                  i = 1;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     i = 1;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     
                     pages.push(desc);
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 2;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     i = 2;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     
                     pages.push(desc);
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 3;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     i = 3;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     
                     pages.push(desc);
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 4;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 4;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     pages.push(desc);
                     i = 5;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 5;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     pages.push(desc);
                     i = 6;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 6;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     pages.push(desc);
                     i = 7;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 7;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     pages.push(desc);
                     i = 8;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 8;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     pages.push(desc);
                     i = 9;
               url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
               await request(url2,
               { json: true }, async (e2, res2, body2) => {
                     if (e2) return;
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
                     imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
                     i = 9;
                     let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
                     ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
      • Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
      ` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
      • Obtuviste ${rankE}
      • Mods: *Trabajando en ello*
      • PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
      • Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
      ║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
                     request(`https://osu.ppy.sh/api/get_user?u=${osuUser}&k=${osu.key}&m=${mode}`,
                     { json: true }, async (e3, res3, body3) => {
                        if (e3) return;
                        let userInfo = res3.body[0];
                        pages.push(desc);
                        const embed = new RichEmbed()
                           .setAuthor(`Mejores rendimientos en osu!STD de ${userInfo.username}`, `https://osu.ppy.sh/images/flags/${userInfo.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${userInfo.user_id}/osu`)
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
               });
               });
               });
               });
               });
               });
               });
               });
      });
      return;
   }
   let osuUser = await bd.fetch(`osu.osu.${member.id}.username`);
   if (osuUser === null || osuUser === undefined) {
      deleteMsg(msg, 6000);
      msg.channel.send(`Parece que ${member} no tiene definido ningún nombre de usuario.`)
         .then(m => deleteMsg(m, 5500));
      return;
   }
   deleteMsg(msg);
   let limit = 10;
   let url = `https://osu.ppy.sh/api/get_user_best?u=${osuUser}&` +
   `k=${osu.key}&limit=${limit}&m=${mode}`;
   request(url,
   { json: true }, async (e, res, body) => {
         if (e) return;
         let i = 0;
         let page = 1;
         let info = res.body;
         let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         await request(url2,
         { json: true }, async (e2, res2, body2) => {
            if (e2) return;
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
            i = 0;
            let desc1 = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
            ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
            
            let pages = [];
            let imgs = [];
            pages.push(desc1);
            imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
            i = 1;
         url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         await request(url2,
         { json: true }, async (e2, res2, body2) => {
               if (e2) return;
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
               i = 1;
               let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
               ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
               
               pages.push(desc);
               imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
               i = 2;
         url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         await request(url2,
         { json: true }, async (e2, res2, body2) => {
               if (e2) return;
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
               i = 2;
               let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
               ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
               
               pages.push(desc);
               imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
               i = 3;
         url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         await request(url2,
         { json: true }, async (e2, res2, body2) => {
               if (e2) return;
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
               i = 3;
               let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
               ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
               
               pages.push(desc);
               imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
               i = 4;
         url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         await request(url2,
         { json: true }, async (e2, res2, body2) => {
               if (e2) return;
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
               imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
               i = 4;
               let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
               ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
               pages.push(desc);
               i = 5;
         url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         await request(url2,
         { json: true }, async (e2, res2, body2) => {
               if (e2) return;
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
               imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
               i = 5;
               let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
               ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
               pages.push(desc);
               i = 6;
         url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         await request(url2,
         { json: true }, async (e2, res2, body2) => {
               if (e2) return;
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
               imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
               i = 6;
               let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
               ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
               pages.push(desc);
               i = 7;
         url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         await request(url2,
         { json: true }, async (e2, res2, body2) => {
               if (e2) return;
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
               imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
               i = 7;
               let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
               ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
               pages.push(desc);
               i = 8;
         url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         await request(url2,
         { json: true }, async (e2, res2, body2) => {
               if (e2) return;
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
               imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
               i = 8;
               let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
               ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
               pages.push(desc);
               i = 9;
         url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info[i].beatmap_id}&m=${mode}`;
         await request(url2,
         { json: true }, async (e2, res2, body2) => {
               if (e2) return;
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
               imgs.push(`https://b.ppy.sh/thumb/${bmID}l.jpg`);
               i = 9;
               let desc = `**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})**`+
               ` by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info[i].pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info[i].score} | Combo: **${info[i].maxcombo}**x / **${info2.max_combo}**x -> ${info[i].perfect == 1 ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info[i].count300}\` ║ ${osuE.hit100}: \`${info[i].count100}\` ║ ${osuE.hit50}: \`${info[i].count50}\` ║ ${osuE.hit0}: \`${info[i].countmiss}\` ║\n`;
               request(`https://osu.ppy.sh/api/get_user?u=${osuUser}&k=${osu.key}&m=${mode}`,
               { json: true }, async (e3, res3, body3) => {
                  if (e3) return;
                  let userInfo = res3.body[0];
                  pages.push(desc);
                  const embed = new RichEmbed()
                     .setAuthor(`Mejores rendimientos en osu!STD de ${userInfo.username}`, `https://osu.ppy.sh/images/flags/${userInfo.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${userInfo.user_id}/osu`)
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
         });
         });
         });
         });
   });
}