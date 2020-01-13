const { Client } = require('discord.js');
const pippi = new Client();
const { token } = require('./settings');

pippi.on('ready', () => {
   console.log(`{ ${pippi.user.username} } connected successfully!`);
});

pippi.login(token);