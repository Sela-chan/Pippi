const { Collection } = require('discord.js');
const { readdirSync } = require('fs');

module.exports = async pippi => {
   pippi.commands = new Collection();
   let files = readdirSync('./commands/').filter(f => f.endsWith('.js'));
   for (const file of files) {
      let command = require(`./commands/${file}`);
      pippi.commands.set(command.name, command);
      console.log(`${file} status: ❤`);
   }
}