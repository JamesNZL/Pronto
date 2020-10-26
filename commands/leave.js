'use strict';

const Discord = require('discord.js');

const { ids: { attendanceID }, colours } = require('../config');
const { cmds: { leave } } = require('../cmds');
const { capitalise, cmdError, dtg, sendDM, sendMsg, successReact } = require('../modules');

module.exports = leave;
module.exports.execute = (msg, args) => {
	const { bot } = require('../pronto');

	if (args.length === 0) return cmdError(msg, 'Insufficient arguments.', leave.error);

	const leaveEmbedTitle = 'Leave Request';
	const attendanceChannel = bot.channels.cache.get(attendanceID);

	successReact(msg);

	const attendanceEmbed = new Discord.MessageEmbed()
		.setTitle(leaveEmbedTitle)
		.setColor(colours.leave)
		.setAuthor(msg.member.displayName, msg.author.displayAvatarURL())
		.setDescription(`${msg.author} has requested leave in ${msg.channel}`)
		.addField('Details', capitalise(args.join(' ')))
		.setFooter(dtg());

	const dmEmbed = new Discord.MessageEmbed()
		.setTitle(leaveEmbedTitle)
		.setColor(colours.leave)
		.setAuthor(msg.guild.name, msg.guild.iconURL())
		.setDescription(`Hi ${msg.author}, your submission of leave has been received.`)
		.addField('Details', capitalise(args.join(' ')))
		.setFooter(dtg());

	sendMsg(attendanceChannel, attendanceEmbed);
	sendDM(msg.author, dmEmbed);
};