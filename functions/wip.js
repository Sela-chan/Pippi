const deleteMsg = require('./deleteMsg');

module.exports = (msg) => {
   deleteMsg(msg, 5000);
   msg.channel.send('Parece que esta opción sigue en mantenimiento, lo siento. T-T')
      .then(m => deleteMsg(m, 4500));
   return;
}