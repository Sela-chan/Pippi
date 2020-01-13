module.exports = {
   pagesGeneral: async (msg, embed, page, pages) => {
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
                     .setFooter(`Página ${page} de ${pages.length}`);
                  m.edit(embed);
               });
               forwards.on('collect', () => {
                  if (page === pages.length) return;
                  page++;
                  embed.setDescription(pages[page-1])
                     .setFooter(`Página ${page} de ${pages.length}`);
                  m.edit(embed);
               });
            });
         });
   },

   pagesLangs: async (msg, embed, page, pages1, pages2) => {
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
                  embed.setDescription(`${pages1[page-1][0]} -> **${pages2[page-1][0].toUpperCase()}**
${pages1[page-1][1]} -> **${pages2[page-1][1].toUpperCase()}**
${pages1[page-1][2]} -> **${pages2[page-1][2].toUpperCase()}**
${pages1[page-1][3]} -> **${pages2[page-1][3].toUpperCase()}**
${pages1[page-1][4]} -> **${pages2[page-1][4].toUpperCase()}**`)
                     .setFooter(`Página ${page} de ${pages1.length}`);
                  m.edit(embed);
               });
               forwards.on('collect', () => {
                  if (page === pages1.length) return;
                  page++;
                  embed.setDescription(`${pages1[page-1][0]} -> **${pages2[page-1][0].toUpperCase()}**
${pages1[page-1][1]} -> **${pages2[page-1][1].toUpperCase()}**
${pages1[page-1][2]} -> **${pages2[page-1][2].toUpperCase()}**
${pages1[page-1][3]} -> **${pages2[page-1][3].toUpperCase()}**
${pages1[page-1][4]} -> **${pages2[page-1][4].toUpperCase()}**`)
                     .setFooter(`Página ${page} de ${pages1.length}`);
                  m.edit(embed);
               });
            });
         });
   },

   pagesImage: async (msg, embed, page, pages) => {
      if (!pages || pages.length < 1) {
         msg.channel.send(`No se encontró ningún resultado de \`${search}\``)
            .then(m => deleteMsg(m, 5000));
         return;
      }
      msg.channel.send(embed)
         .then(async m => {
            await m.react('◀')
            .then(async () => {
               await m.react('▶');
               const backwardsF = (reaction, user) => reaction.emoji.name === '◀' && !user.bot;
               const forwardsF = (reaction, user) => reaction.emoji.name === '▶' && !user.bot;
               const backwards = m.createReactionCollector(backwardsF);
               const forwards = m.createReactionCollector(forwardsF);
               backwards.on('collect', () => {
                  if (page === 1) return;
                  page--;
                  embed.setImage(pages[page-1])
                     .setFooter(`Página ${page} de ${pages.length}`);
                  m.edit(embed);
               });
               forwards.on('collect', () => {
                  if (page === pages.length) return;
                  page++;
                  embed.setImage(pages[page-1])
                     .setFooter(`Página ${page} de ${pages.length}`);
                  m.edit(embed);
               });
            });
         });
   },

   pagesMusic: async (msg, embed, page, pages) => {
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
                  embed.setDescription(`${pages[page-1].toString().replace(/,/g, '\n')}\n\nEscoge un número de la lista.`)
                     .setFooter(`Página ${page} de ${pages.length}`);
                  m.edit(embed);
               });
               forwards.on('collect', () => {
                  if (page === pages.length) return;
                  page++;
                  embed.setDescription(`${pages[page-1].toString().replace(/,/g, '\n')}\n\nEscoge un número de la lista.`)
                     .setFooter(`Página ${page} de ${pages.length}`);
                  m.edit(embed);
               });
            });
         });
   }
}