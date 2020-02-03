const { Client } = require('discord.js');
const pippi = new Client();
const { token, prefix } = require('./functions/settings');
const imgur = require('./functions/imgur');

require('./cmdHandler')(pippi);

pippi.on('ready', () => {
   console.log(`{ ${pippi.user.username} } connected successfully!`);
   pippi.user.setStatus('idle');

   let statuses = [
      `osu!`
   ];
   let i = 0;
   setInterval(function() {
      let status = statuses[i];
      Maika.user.setActivity(status, {
         type: "STREAMING",
         url: "https://www.twitch.tv/selavid"
      });
      i++;
      if (i >= statuses.length) i = i - statuses.length;
   }, 35000);
});

pippi.on('message', async msg => {
   if (msg.mentions.users.first() !== pippi.user) return;
   let args = msg.content.slice(`${pippi.user} `.length).trim().split(/ +/g);
   let cmd = args.shift().toLowerCase();
   let command = pippi.commands.get(cmd) || pippi.commands.find(c => c.aliases.includes(cmd));
   if (!command) return;
   command.run(pippi, msg, args);
});

pippi.login(token);