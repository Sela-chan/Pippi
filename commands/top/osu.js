const { RichEmbed } = require('discord.js');
const bd = require('quick.db');
const fs = require('fs');
const request = require('request');
const deleteMsg = require('../../functions/deleteMsg');
const getRankEM = require('../../functions/osuRanks');
const wip = require('../../functions/wip');
const { osuE } = require('../../functions/emojis');
const { prefix, osu, owner } = require('../../functions/settings');

module.exports = async (msg, args) => {
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
      let url = `https://osu.ppy.sh/api/get_user_best?u=${osuUser}&` +
      `k=${osu.key}&limit=${limit}&m=0`;
      request(url,
      { json: true }, (e, res, body) => {
         if (e) return;
         let i = 0;
         let info = res.body[i];
         let url2 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${info.beatmap_id}&m=0`;
         request(url2,
         { json: true }, (e2, res2, body2) => {
            if (e2) return;
            let info2 = res2.body[0];
            let rankE = info.rank === 'XH' ? osuE.XH : 
            info.rank === 'SH' ? osuE.SH :
            info.rank === 'X' ? osuE.X :
            info.rank === 'S' ? osuE.S :
            info.rank === 'A' ? osuE.A :
            info.rank === 'B' ? osuE.B :
            info.rank === 'C' ? osuE.C :
            info.rank === 'D' ? osuE.D : '';
            const embed = new RichEmbed()
               .setDescription(`**${i+1}.** **[${info2.title}](https://osu.ppy.sh/beatmapsets/${info2.beatmapset_id}#osu/${info2.beatmap_id})** by [${info2.creator}](https://osu.ppy.sh/users/${info2.creator_id}) [${info2.version}]
• Dificultad: ${'⭐'.repeat(Math.floor(info2.difficultyrating))+
` \`(${(Math.round(info2.difficultyrating * 100) / 100).toFixed(2)}*)\``}
• Obtuviste ${rankE}
• Mods: *Trabajando en ello*
• PP: ${(Math.round(info.pp * 100) / 100).toFixed(2)} ║ Acc: *Trabajando en ello*
• Puntuación: ${info.score} | Combo: **${info.maxcombo}**x / **${info2.max_combo}**x -> ${info.perfect == 1 ? '**FC!**' : 'No FC T-T'}
║ ${osuE.hit300}: \`${info.count300}\` ║ ${osuE.hit100}: \`${info.count100}\` ║ ${osuE.hit50}: \`${info.count50}\` ║ ${osuE.hit0}: \`${info.countmiss}\` ║\n\n`)
               .setTimestamp();
            msg.channel.send(embed);
         });
      });
//       fetch(url, { method: "Get" })
//          .then(r => r.json())
//          .then(async osuInfo => {
//             for (j = 0; j < osuInfo.length; j++) {
//                bd.push(`temp.osu.beatmap_id`, osuInfo[j].beatmap_id);
//                bd.push(`temp.osu.rank`, osuInfo[j].rank);
//                bd.push(`temp.osu.pp`, osuInfo[j].pp);
//                bd.push(`temp.osu.score`, osuInfo[j].score);
//                bd.push(`temp.osu.maxcombo`, osuInfo[j].maxcombo);
//                bd.push(`temp.osu.perfect`, osuInfo[j].perfect);
//                bd.push(`temp.osu.count300`, osuInfo[j].count300);
//                bd.push(`temp.osu.count100`, osuInfo[j].count100);
//                bd.push(`temp.osu.count50`, osuInfo[j].count50);
//                bd.push(`temp.osu.countmiss`, osuInfo[j].countmiss);
//             }
//          });
//       let url2 = `https://osu.ppy.sh/api/get_user?u=${osuUser}&k=${osu.key}&m=0`;
//       fetch(url2, { method: "Get" })
//          .then(r => r.json())
//          .then(userInfo => {
//             fs.writeFileSync("./commands/osu!/tempJSON/userInfo.json", `{\n   "osuUserArr": ${JSON.stringify(userInfo)
//                .replace(/{/g, '   {\n      ').replace(/},/g, '\n   },\n')
//                .replace(/",/g, '",\n      ').replace(/}]/g, '\n      }\n   ]')}\n}`);
//          });
//       for (i = 0; i < limit; i++) {
//          let beatmap_id = await bd.get(`temp.osu.beatmap_id`);
//          let url3 = `https://osu.ppy.sh/api/get_beatmaps?k=${osu.key}&b=${beatmap_id[i]}&m=0`;
//          fetch(url3, { method: "Get" })
//          .then(r => r.json())
//          .then(async bmInfo => {
//             deleteMsg(msg);
//             let desc = '';
//             let rank = await bd.fetch(`temp.osu.rank`);
//             let pp = await bd.fetch(`temp.osu.pp`);
//             let score = await bd.fetch(`temp.osu.score`);
//             let maxcombo = await bd.fetch(`temp.osu.maxcombo`);
//             let perfect = await bd.fetch(`temp.osu.perfect`);
//             let count300 = await bd.fetch(`temp.osu.count300`);
//             let count100 = await bd.fetch(`temp.osu.count100`);
//             let count50 = await bd.fetch(`temp.osu.count50`);
//             let countmiss = await bd.fetch(`temp.osu.countmiss`);
//             // for (k = 0; k < osuInfoArr.length; k++) {
//             //    ranks.push(require(`./tempJSON/rank${k}.json`).rank);
//             //    pp.push(require(`./tempJSON/pp${k}.json`).pp);
//             //    score.push(require(`./tempJSON/score${k}.json`).score);
//             //    maxcombo.push(require(`./tempJSON/maxcombo${k}.json`).maxcombo);
//             //    perfect.push(require(`./tempJSON/perfect${k}.json`).perfect);
//             //    count300.push(require(`./tempJSON/count300${k}.json`).count300);
//             //    count100.push(require(`./tempJSON/count100${k}.json`).count100);
//             //    count50.push(require(`./tempJSON/count50${k}.json`).count50);
//             //    countmiss.push(require(`./tempJSON/countmiss${k}.json`).countmiss);
//             // }
//             let y = bmInfo[0];
//             bd.set(`tempImageBG`, y.beatmapset_id);
//             desc = desc + `**${i+1}.** **[${y.title}](https://osu.ppy.sh/beatmapsets/${y.beatmapset_id}#osu/${y.beatmap_id})** by [${y.creator}](https://osu.ppy.sh/users/${y.creator_id}) [${y.version}]
// • Dificultad: ${'⭐'.repeat(Math.floor(y.difficultyrating))}
// • Obtuviste ${getRankEM(rank[i])}
// • Mods: *Trabajando en ello*
// • PP: ${(Math.round(pp[i] * 100) / 100).toFixed(2)} | Acc: *Trabajando en ello*
// • Puntuación: ${score[i]} | Combo: **${maxcombo[i]}**x / **${y.max_combo}**x -> ${perfect[i] == 1 ? '**FC!**' : 'No FC T-T'}
// | ${osuE.hit300}: ${count300[i]} | ${osuE.hit100}: ${count100[i]} | ${osuE.hit50}: ${count50[i]} | ${osuE.hit0}: ${countmiss[i]} |\n\n`;
//             await bd.set(`tempBMInfo`, desc);
//          });
//       }
//       let info = await bd.fetch(`tempBMInfo`);
//       let z = await require('./tempJSON/userInfo.json').osuUserArr[0];
//       const embed = new RichEmbed()
//          .setAuthor(`Mejores rendimientos en osu!STD de ${z.username}`, `https://osu.ppy.sh/images/flags/${z.country.toUpperCase()}.png`, `https://osu.ppy.sh/users/${z.user_id}/osu`)
//          .setColor(msg.member.displayHexColor === '#000000' ? put.turquoise : msg.member.displayHexColor)
//          .setThumbnail(`https://b.ppy.sh/thumb/${bd.get(`tempImageBG`)}l.jpg`)
//          .setDescription(info)
//          .setTimestamp();
//       msg.channel.send(embed);
//       return;
   }
//    return;
}