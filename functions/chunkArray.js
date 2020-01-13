module.exports = async (arr, chunks) => {
   var newArray = [];
   while (arr.length) {
      newArray.push(arr.splice(0, chunks));
   }
   return newArray;
}