module.exports = {
   token: process.env.token,
   prefix: pippi => {
      return `${pippi.user} `;
   },
   owner: {
		id: '474204150511697923'
   },
   osu: {
		key: process.env.osukey
	}
}
