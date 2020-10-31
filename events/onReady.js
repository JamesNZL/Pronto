'use strict';

const { ids: { devID } } = require('../config');
const { embedScaffold, pCmd } = require('../modules');
const { botPermsHandler } = require('../handlers');

module.exports = {
	events: ['ready'],
	process: [],
	async execute() {
		const { bot } = require('../pronto');
		const { cmds: { help }, colours } = await require('../handlers/database')();

		const dev = await bot.users.fetch(devID);

		console.info(`Logged in as ${bot.user.tag}!`);
		bot.user.setActivity(`the radio net | ${await pCmd(help)}`, { type: 'LISTENING' });

		embedScaffold(dev, '**Ready to go!**', colours.success, 'dev');

		botPermsHandler();
	},
};