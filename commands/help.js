'use strict';

const Discord = require('discord.js');
const { ids: { devID } } = require('../config');
const { delMsg, dmCmdError, embedScaffold, errorReact, getRoleError, pCmd, sendDM, sendMsg, successReact } = require('../modules');
const { permissionsHandler } = require('../handlers');

module.exports = async guild => {
	const { cmds: { help }, cmdsList } = await require('../cmds')(guild);
	const { config: { prontoLogo }, ids: { serverID, adjPlus }, colours } = await require('../handlers/database')(guild);

	help.execute = (msg, args) => {
		const { bot } = require('../pronto');

		const server = bot.guilds.cache.get(serverID);
		const helpEmbed = new Discord.MessageEmbed();
		const msgCmd = args[0]
			? args[0].toLowerCase()
			: null;

		if (!msg.guild && !server.available) {
			errorReact(msg);
			return embedScaffold(msg.author, 'There was an error reaching the server, please try again later.', colours.error, 'dm');
		}

		const memberRoles = (msg.guild)
			? msg.member.roles.cache
			: server.members.cache.get(msg.author.id).roles.cache;

		if (!memberRoles) return getRoleError(msg);

		if (msg.guild) delMsg(msg);

		const cmd = bot.commands.get(msgCmd) || bot.commands.find(command => command.aliases && command.aliases.includes(msgCmd));

		(cmd)
			? permissionsHandler(msg, cmd)
				? sendHelpEmbed(cmd)
				: (msg.guild)
					? sendCmdList()
					: dmCmdError(msg, 'noPerms')
			: sendCmdList();

		function sendHelpEmbed(command) {
			helpEmbed.setTitle(`Command: ${pCmd(command, guild)}`);
			helpEmbed.setColor(colours.pronto);
			helpEmbed.setDescription(command.help);

			if (msg.guild) {
				helpEmbed.setFooter(`Requested by ${msg.member.displayName}`);
				return sendMsg(msg.channel, helpEmbed);
			}

			else if (!helpEmbed.description.includes('Allowed Roles')) {
				successReact(msg);
				return sendDM(msg.author, helpEmbed);
			}

			else return dmCmdError(msg, 'hasRole');
		}

		async function sendCmdList() {
			let commandList;

			for (const values of Object.values(cmdsList)) {
				if (!values.type) commandList = values.cmds;

				if (values.type === 'noRole') {
					commandList = (!memberRoles.some(roles => values.ids.includes(roles.id)))
						? values.cmds
						: commandList;
				}

				else if (values.type === 'role') {
					commandList = (memberRoles.some(roles => values.ids.includes(roles.id)))
						? values.cmds
						: commandList;
				}

				else if (values.type === 'dev') {
					commandList = (msg.author.id === devID)
						? values.cmds
						: commandList;
				}
			}

			const james = await bot.users.fetch('192181901065322496');

			if (!msg.guild && msgCmd) errorReact(msg);

			else if (!msg.guild) successReact(msg);

			helpEmbed.setTitle('Commands List');
			helpEmbed.setThumbnail(prontoLogo);
			helpEmbed.setColor(colours.pronto);
			helpEmbed.setDescription(commandList);
			helpEmbed.setFooter(`Developed by ${james.tag}`, james.avatarURL());

			if (!memberRoles.some(roles => adjPlus.includes(roles.id)) && msg.author.id !== devID) {
				helpEmbed.addField('Note', `Only displaying commands available to ${msg.author}.`);
			}

			sendDM(msg.author, helpEmbed);
		}
	};

	return help;
};