const { prefix } = require('../functions/settings');

module.exports = {
   name: 'invite',
   aliases: ['inv'],
   usage: `${prefix}invite`,
   perms: [],
   desc: `Puedes invitarme a cualquier servidor en el que tengas el permiso *Administrar servidor*.`,
   run: async (pippi, msg, args) => {
      msg.channel.send(`https://discordapp.com/oauth2/authorize?client_id=${pippi.user.id}&scope=bot&permissions=537226320`)
      .then(m => m.react('<a:EBowowo:667478389216509992>'));
   }
}