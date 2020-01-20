module.exports = {
   pagesGeneral: async (msg, embed, page, pages, imgs) => {
      msg.channel.send(embed)
         .then(async m => {
            await m.react('◀')
            .then(async () => {
               await m.react('▶');
               const backwardsF = (reaction, user) => reaction.emoji.name === '◀' && user.id === msg.author.id;
               const forwardsF = (reaction, user) => reaction.emoji.name === '▶' && user.id === msg.author.id;
               const backwards = m.createReactionCollector(backwardsF);
               const forwards = m.createReactionCollector(forwardsF);
               backwards.on('collect', () => {
                  if (page === 1) return;
                  page--;
                  embed.setDescription(pages[page-1])
                     .setImage(imgs[page-1])
                     .setFooter(`Página ${page} de ${pages.length}`);
                  m.edit(embed);
               });
               forwards.on('collect', () => {
                  if (page === pages.length) return;
                  page++;
                  embed.setDescription(pages[page-1])
                     .setImage(imgs[page-1])
                     .setFooter(`Página ${page} de ${pages.length}`);
                  m.edit(embed);
               });
            });
         });
   }
}