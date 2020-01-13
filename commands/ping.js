const { prefix } = require('../functions/settings');

module.exports = {
   name: 'ping',
   aliases: [],
   usage: `${prefix}ping`,
   perms: [],
   desc: `Pruébalo.`,
   run: async (pippi, msg, args) => {
      msg.channel.send('Pong! 🏓');
   }
}