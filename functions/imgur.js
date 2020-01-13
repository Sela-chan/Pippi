module.exports = (id, extension) => {
   if (id.length !== 7) return console.log('ID no válida.');
   if (!isNaN(id)) return console.log('ID no válida.');
   if (!isNaN(extension)) return console.log('Extensión no puede ser un número.');
   let exts = [
      'png', 'gif', 'jpg',
      '.png', '.gif', '.jpg'
   ];
   if (!exts.find(ext => ext === extension)) return console.log('Extensión no valida.');
   if (extension.startsWith('.')) {
      return `https://i.imgur.com/${id}${extension}`;
   } else {
      return `https://i.imgur.com/${id}.${extension}`;
   }
}