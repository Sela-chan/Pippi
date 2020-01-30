const prefix = '@Pippi ';
const deleteMsg = require('../functions/deleteMsg');
const imgur = require('../functions/imgur');

module.exports = {
   name: "createwh",
   aliases: ["cwh"],
   usage: `${prefix}createwh`,
   perms: [],
   desc: `Crea Webhooks en el canal donde se usa el comando, para el envío de mensajes.`,
   run: async (pippi, msg, args, ops) => {
      await msg.channel.fetchWebhooks()
      .then(async wh => {
         if (wh.find(w => w.name === 'Mania!') &&
         wh.find(w => w.name === 'Catch The Beat!') &&
         wh.find(w => w.name === 'Taiko!')) {
            msg.channel.send('Ya están creados los webhooks para este canal.')
            .then(m => {
               deleteMsg(msg);
               deleteMsg(m, 4500);
            });
            return;
         }
         await msg.channel.createWebhook('Mania!', imgur('mBmZysm', 'png'));
         await msg.channel.createWebhook('Catch The Beat!', imgur('WBo7FTF', 'png'));
         await msg.channel.createWebhook('Taiko!', imgur('SgfVDlR', 'png'));
         console.log(`Webhooks created on ${msg.guild.name}`);
         await msg.channel.send('¡Listo!')
         .then(m => {
            deleteMsg(msg);
            deleteMsg(m, 3500);
         });
      });
   }
}



