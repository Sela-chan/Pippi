module.exports = async (msg, time) => {
   if (!msg) return console.log('Se esperaba un objeto Discord#Message para el argumento { msg }');
   if (!time) {
      msg.delete().catch(() => console.log(`Mensaje [ ${msg.content} ] con ID < ${msg.id} > ya fue eliminado.`));
      return;
   }
   if (isNaN(time)) return console.log('Se esperaba un número para el argumento { time }')
   msg.delete(time).catch(() => console.log(`Mensaje [ ${msg.content} ] con ID < ${msg.id} > ya fue eliminado.`));
}