const { Client } = require('discord.js');
const pippi = new Client();
const { token, prefix } = require('./functions/settings');

require('./cmdHandler')(pippi);

pippi.on('ready', () => {
   console.log(`{ ${pippi.user.username} } connected successfully!`);
});

pippi.on('message', async msg => {
   if (!msg.content.startsWith(prefix)) return;
   let args = msg.content.slice(prefix.length).trim().split(/ +/g);
   let cmd = args.shift().toLowerCase();
   let command = pippi.commands.get(cmd) || pippi.commands.find(c => c.aliases.includes(cmd));
   if (!command) return;
   command.run(pippi, msg, args);
});

pippi.login(token);