const Discord = require('discord.js');
const dateFormat = require('dateformat');

const config = require('../config');
const { config: { dateOutput }, ids: { attendanceID } } = config;
const { emojis: { successEmoji }, colours } = config;
const { cmds: { help, leave, leaveFor } } = require('../cmds');
const { pCmd, capitalise, cmdError, sendMsg, dmError, debugError } = require('../modules');

module.exports = leaveFor;
module.exports.execute = (msg, args) => {
	'use strict';

	const { bot } = require('../pronto.js');
	const memberMentions = msg.mentions.members;
	const numMemberMentions = memberMentions.size;
	const absentee = memberMentions.first();

	try {
		if (numMemberMentions === 0) throw 'You must tag a user.';

		else if (memberMentions.some(mention => mention.user.bot)) throw 'You cannot submit leave for a bot!';

		else if (numMemberMentions > 1) throw 'You must submit leave individually.';

		else if (args.length < 2) throw 'Insufficient arguments.';
	}

	catch(error) { return cmdError(msg, error, leaveFor.error); }

	const leaveForEmbedTitle = 'Leave Request (For)';
	const messageAuthor = msg.author;
	const attendanceChannel = bot.channels.cache.get(attendanceID);
	const successEmojiObj = msg.guild.emojis.cache.find(emoji => emoji.name === successEmoji);

	msg.react(successEmojiObj).catch(error => debugError(error, `Error reacting to [message](${msg.url}) in ${msg.channel}.`));

	const mentionIndex = args.indexOf(`<@!${absentee.user.id}>`);
	if (mentionIndex > -1) args.splice(mentionIndex, 1);

	const attendanceEmbed = new Discord.MessageEmbed()
		.setTitle(leaveForEmbedTitle)
		.setColor(colours.leave)
		.setAuthor(absentee.displayName, absentee.user.displayAvatarURL())
		.setDescription(`${messageAuthor} has submitted leave for ${absentee} in ${msg.channel}`)
		.addFields(
			{ name: 'Date', value: dateFormat(dateOutput) },
			{ name: 'Absentee', value: absentee },
			{ name: 'Details', value: capitalise(args.join(' ')) },
		);

	const dmEmbed = new Discord.MessageEmbed()
		.setTitle(leaveForEmbedTitle)
		.setColor(colours.leave)
		.setAuthor(msg.guild.name, msg.guild.iconURL())
		.setDescription(`Hi ${messageAuthor}, your submission of leave for ${absentee} has been received.`)
		.addFields(
			{ name: 'Date', value: dateFormat(dateOutput) },
			{ name: 'Channel', value: msg.channel.toString() },
			{ name: 'Details', value: capitalise(args.join(' ')) },
		);

	const absenteeEmbed = new Discord.MessageEmbed()
		.setTitle(leaveForEmbedTitle)
		.setColor(colours.leave)
		.setAuthor(msg.guild.name, msg.guild.iconURL())
		.setDescription(`${messageAuthor} has submitted leave for you in ${msg.channel}.`)
		.addFields(
			{ name: 'Date', value: dateFormat(dateOutput) },
			{ name: 'Channel', value: msg.channel.toString() },
			{ name: 'Details', value: capitalise(args.join(' ')) },
		)
		.setFooter(`Reply with ${pCmd(help)} ${leave.cmd} to learn how to request leave for yourself.`);

	sendMsg(attendanceChannel, attendanceEmbed);
	messageAuthor.send(dmEmbed).catch(error => dmError(msg, error));
	absentee.send(absenteeEmbed).catch(error => dmError(msg, error, true));
};