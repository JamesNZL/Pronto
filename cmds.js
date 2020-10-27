'use strict';

const { config: { prefix }, ids } = require('./config');
const { pCmd, rolesOutput } = require('./modules');

const cmds = {
	ping: {
		cmd: 'ping',
		aliases: ['p'],
		desc: 'Test the latency of the bot.',
		allowDM: true,
		roles: [],
		noRoles: [],
		devOnly: true,
		get help() {
			delete this.help;
			return this.help = helpText({
				'Aliases': pAls(this),
				'Description': this.desc,
				'Usage': pCmd(this),
			});
		},
	},
	uptime: {
		cmd: 'uptime',
		aliases: ['up'],
		desc: 'Time since last restart.',
		allowDM: true,
		roles: [],
		noRoles: [],
		devOnly: true,
		get help() {
			delete this.help;
			return this.help = helpText({
				'Aliases': pAls(this),
				'Description': this.desc,
				'Usage': pCmd(this),
			});
		},
	},
	evaluate: {
		cmd: 'evaluate',
		aliases: ['eval'],
		desc: 'Evaluate Javascript code.',
		allowDM: true,
		roles: [],
		noRoles: [],
		devOnly: true,
		get help() {
			delete this.help;
			return this.help = helpText({
				'Aliases': pAls(this),
				'Description': this.desc,
				'Usage': `${pCmd(this)} <code>`,
			});
		},
		get error() { return errorText(this.help, this.cmd); },
	},
	restart: {
		cmd: 'restart',
		aliases: ['new', 'kill', 'update'],
		desc: 'Restart the bot.',
		allowDM: true,
		roles: [],
		noRoles: [],
		devOnly: true,
		get help() {
			delete this.help;
			return this.help = helpText({
				'Aliases': pAls(this),
				'Description': this.desc,
				'Usage': pCmd(this),
			});
		},
	},
	help: {
		cmd: 'help',
		aliases: ['cmd', 'cmds', 'command', 'commands'],
		desc: {
			general: 'Get help with using Pronto.',
			unqualified: 'List of the commands you can use.',
			qualified: 'Get help with a specific command.',
		},
		allowDM: true,
		roles: [ids.everyoneID],
		noRoles: [],
		devOnly: false,
		get help() {
			delete this.help;
			return this.help = helpText({
				'Aliases': pAls(this),
				'Description': this.desc.general,
				'Usage': `${pCmd(this)} [command]`,
				'Examples': `\n${pCmd(this)}\n${pCmd(this)} ${cmds.leave.cmd}`,
			});
		},
	},
	leave: {
		cmd: 'leave',
		aliases: ['lv'],
		desc: 'Submit a leave request.',
		allowDM: false,
		roles: [],
		noRoles: ids.nonCadet,
		devOnly: false,
		get help() {
			delete this.help;
			return this.help = helpText({
				'Aliases': pAls(this),
				'Description': this.desc,
				'Usage': `${pCmd(this)} <dates> <activity> <reason> [additional remarks]`,
				'Example': `${pCmd(this)} 01 Jan for Parade Night due to an appointment`,
			});
		},
		get error() { return errorText(this.help, this.cmd); },
	},
	leaveFor: {
		cmd: 'leavefor',
		aliases: ['lv4'],
		desc: 'Submit a leave request for another cadet.',
		allowDM: false,
		roles: ids.tacPlus,
		noRoles: [],
		devOnly: false,
		get help() {
			delete this.help;
			return this.help = helpText({
				'Aliases': pAls(this),
				'Description': this.desc,
				'Usage': `${pCmd(this)} <user> <dates> <activity> <reason> [additional remarks]`,
				'Example': `${pCmd(this)} <@${ids.devID}> 01 Jan for Parade Night due to an appointment`,
				'Allowed Roles': rolesOutput(this.roles),
			});
		},
		get error() { return errorText(this.help, this.cmd); },
	},
	attendance: {
		cmd: 'attendance',
		aliases: ['att', 'attdnce'],
		desc: 'Submit an attendance register.',
		allowDM: false,
		roles: ids.tacPlus,
		noRoles: [],
		devOnly: false,
		get help() {
			delete this.help;
			return this.help = helpText({
				'Aliases': pAls(this),
				'Description': this.desc,
				'Usage': `\n${pCmd(this)} <message>\n${pCmd(this)} update <message>`,
				'Allowed Roles': rolesOutput(this.roles),
			});
		},
		get error() { return errorText(this.help, this.cmd); },
	},
	connected: {
		cmd: 'connected',
		aliases: ['cnnct', 'cnnctd'],
		desc: 'List the members connected to a voice channel.',
		allowDM: false,
		roles: ids.sgtPlus,
		noRoles: [],
		devOnly: false,
		get help() {
			delete this.help;
			return this.help = helpText({
				'Aliases': pAls(this),
				'Description': this.desc,
				'Usage': `${pCmd(this)} <voice channel>`,
				'Example': `${pCmd(this)} <#${ids.exampleVoiceID}>`,
				'Allowed Roles': rolesOutput(this.roles),
			});
		},
		get error() { return errorText(this.help, this.cmd); },
	},
	archive: {
		cmd: 'archive',
		aliases: ['archv'],
		desc: 'Archive a text channel.',
		allowDM: false,
		roles: ids.cqmsPlus,
		noRoles: [],
		devOnly: false,
		get help() {
			delete this.help;
			return this.help = helpText({
				'Aliases': pAls(this),
				'Description': this.desc,
				'Usage': `${pCmd(this)} <text channel>`,
				'Example': `${pCmd(this)} <#${ids.exampleTextID}>`,
				'Allowed Roles': rolesOutput(this.roles),
			});
		},
		get error() { return errorText(this.help, this.cmd); },
	},
	purge: {
		cmd: 'purge',
		aliases: ['del', 'delete', 'clear'],
		desc: 'Delete a number of messages from a channel.',
		allowDM: false,
		roles: ids.adjPlus,
		noRoles: [],
		devOnly: false,
		get help() {
			delete this.help;
			return this.help = helpText({
				'Aliases': pAls(this),
				'Description': this.desc,
				'Usage': `${pCmd(this)} <count> [user]`,
				'Examples': `\n${pCmd(this)} 10\n${pCmd(this)} 5 <@${ids.devID}>`,
				'Allowed Roles': rolesOutput(this.roles),
			});
		},
		get error() { return errorText(this.help, this.cmd); },
	},
};

const cmdsList = {
	all: {
		type: 'role',
		ids: [ids.everyoneID],
		get cmds() {
			delete this.cmds;
			return this.cmds = commandText(this.ids, this.type);
		},
	},
	cdt: {
		type: 'noRole',
		ids: ids.nonCadet,
		get cmds() {
			delete this.cmds;
			return this.cmds = cmdsList.all.cmds + '\n' + commandText(this.ids, this.type);
		},
	},
	tac: {
		type: 'role',
		ids: ids.tacPlus,
		get cmds() {
			delete this.cmds;
			return this.cmds = cmdsList.cdt.cmds + '\n' + commandText(this.ids, this.type);
		},
	},
	sgt: {
		type: 'role',
		ids: ids.sgtPlus,
		get cmds() {
			delete this.cmds;
			return this.cmds = cmdsList.tac.cmds + '\n' + commandText(this.ids, this.type);
		},
	},
	cqms: {
		type: 'role',
		ids: ids.cqmsPlus,
		get cmds() {
			delete this.cmds;
			return this.cmds = cmdsList.sgt.cmds + '\n' + commandText(this.ids, this.type);
		},
	},
	adj: {
		type: 'role',
		ids: ids.adjPlus,
		get cmds() {
			delete this.cmds;
			return this.cmds = cmdsList.cqms.cmds + '\n' + commandText(this.ids, this.type);
		},
	},
	dev: {
		type: 'dev',
		ids: ids.devID,
		get cmds() {
			delete this.cmds;
			return this.cmds = cmdsList.adj.cmds + '\n' + commandText(this.ids, this.type);
		},
	},
};

function commandText(tier, type) {
	const object = {};

	for (const cmd of Object.values(cmds)) {
		else if ((type === 'role' && cmd.roles === tier)
			|| (type === 'noRole' && cmd.noRoles === tier)
			|| (type === 'dev' && cmd.devOnly)) {

			if (cmd === cmds.help) {
				object[`${pCmd(cmds.help)}`] = cmds.help.desc.unqualified;
				object[`${pCmd(cmds.help)} [command]`] = cmds.help.desc.qualified;
				continue;
			}

			object[`${pCmd(cmd)}`] = cmd.desc;
		}
	}

	return helpText(object, true);
}

function helpText(object, forList) {
	let helpString = '';

	const [startFormat, endFormat] = (forList)
		? ['`', '` - ']
		: ['**', ':** '];

	for (const [property, value] of Object.entries(object)) {
		helpString += `${startFormat}${property}${endFormat}${value}\n`;
	}

	return helpString.slice(0, helpString.length - 2);
}

function errorText(helpTxt, cmd) {
	return '\n\n' + helpTxt + '\n' + helpText({
		'Help Command': `${pCmd(cmds.help)} ${cmd}`,
	});
}

function pAls(cmd) {
	const als = [...cmd.aliases];
	for (let i = 0; i < als.length; i++) als[i] = `${prefix}${als[i]}`;
	return als.join(', ');
}

module.exports = {
	cmds: cmds,
	cmdsList: cmdsList,
};