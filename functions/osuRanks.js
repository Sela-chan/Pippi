const { osuE } = require('./emojis');

module.exports = async rank => {
   if (rank === 'XH') return osuE.XH;
   if (rank === 'SH') return osuE.SH;
   if (rank === 'X') return osuE.X;
   if (rank === 'S') return osuE.S;
   if (rank === 'A') return osuE.A;
   if (rank === 'B') return osuE.B;
   if (rank === 'C') return osuE.C;
   if (rank === 'D') return osuE.D;
}