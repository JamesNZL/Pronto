'use strict';

const Discord = require('discord.js');

const { colours } = require('../config');
const { cmds: { uptime } } = require('../cmds');
const { dtg, formatAge, sendMsg } = require('../modules');

module.exports = uptime;
module.exports.execute = msg => {
	const { bot, version } = require('../pronto');

	const uptimeEmbed = new Discord.MessageEmbed()
		.setColor(colours.success)
		.setFooter(`${formatAge(bot.uptime)} | ${dtg()} | Pronto v${version}`);

	sendMsg(msg.channel, uptimeEmbed);
};