'use strict';

const Discord = require('discord.js');
const { debugError, dmCmdError, pCmd, stripID } = require('../modules');

module.exports = async msg => {
	const { bot } = require('../pronto');
	const { updateCommands, permissionsHandler } = require('./');
	const { config: { prefix }, cmds: { help } } = await require('./database')(msg.guild);

	if (msg.author.bot) return;

	const args = msg.content.split(/ +/);

	if (!msg.content.startsWith(prefix) && (stripID(args[0]) !== bot.user.id || args.length === 1)) return;

	await updateCommands(msg.guild);

	bot.commands = new Discord.Collection();
	const botCommands = await require('../commands')(msg.guild);

	Object.keys(botCommands).map(key => {
		bot.commands.set(botCommands[key].cmd, botCommands[key]);
	});

	const msgCmd = (stripID(args[0]) === bot.user.id)
		? args.splice(0, 2)[1].toLowerCase()
		: args.shift().toLowerCase().replace(prefix, '');

	const helpCmd = bot.commands.get(help.cmd);

	const cmd = bot.commands.get(msgCmd) || bot.commands.find(command => command.aliases && command.aliases.includes(msgCmd));

	if (!cmd) {
		const regExp = /[a-zA-Z]/g;
		return (regExp.test(msgCmd))
			? (!msg.guild)
				? dmCmdError(msg)
				: helpCmd.execute(msg, args)
			: null;
	}

	const hasPerms = await permissionsHandler(msg, cmd);

	if (hasPerms === 'err') return;

	if (msg.guild && !hasPerms) return helpCmd.execute(msg, args);
	else if (!msg.guild && !hasPerms) return dmCmdError(msg, 'noPerms');
	else if (!msg.guild && !cmd.allowDM) return dmCmdError(msg, 'noDM');

	try {
		cmd.execute(msg, args, msgCmd);
	}

	catch (error) {
		debugError(error, `Error executing ${await pCmd(cmd, msg.guild)}`);
	}
};