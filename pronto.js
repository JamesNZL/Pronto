require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const modules = require('./modules');
const pairs = require('./channelPairs');
prefix = modules.constObj.prefix;
const dateFormat = require('dateformat');

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => onReady());
bot.on('message', msg => onMessage(msg));
bot.on('guildMemberAdd', member => onMemberAdd(member));
bot.on('guildMemberRemove', member => onMemberRemove(member));
bot.on('guildMemberUpdate', (oldMember, newMember) => onMemberUpdate(oldMember, newMember));
bot.on('voiceStateUpdate', (oldState, newState) => onVoiceUpdate(oldState, newState));
bot.on('messageDelete', msg => onMessageDelete(msg));
bot.on('messageDeleteBulk', msgs => onBulkDelete(msgs));
bot.on('debug', info => onDevInfo(info, 'Debug'));
bot.on('error', info => onDevInfo(info, 'Error'));
bot.on('warn', info => onDevInfo(info, 'Warn'));

function onReady() {
    console.info(`Logged in as ${bot.user.tag}!`);

    readyEmbed = new Discord.MessageEmbed()
        .setColor(modules.constObj.success)
        .setAuthor(bot.user.tag, bot.user.avatarURL())
        .setDescription(`**Ready to go!**`)
        .setFooter(`${dateFormat(Date.now(), modules.constObj.dateOutput)} | Pronto v${modules.constObj.version}`);
    bot.channels.cache.get(modules.constObj.debugID).send(readyEmbed);

    if (bot.user.discriminator == '7780') prefix = '-';

    bot.user.setActivity(`the radio net | ${prefix}${modules.cmdList.helpCmd}`, {type: 'LISTENING'});
};

function onMessage(msg) {
    if (msg.channel.type === 'news') msg.react('✅');

    if (msg.author.bot || !msg.content.startsWith(prefix)) return;
    
    if (msg.guild === null && msg.content !== `${prefix}${modules.cmdList.helpCmd} ${modules.cmdList.leaveCmd}`) return;

    const args = msg.content.split(/ +/);
    const command = args.shift().toLowerCase().replace(prefix, '');

    if (command === 'restart' && msg.author.id === modules.constObj.devID) process.exit();

    if (command === 'test') { bot.emit('guildMemberAdd', msg.guild.members.cache.get('192181901065322496')); return; }

    if (!bot.commands.has(command)) {
        var regExp = /[a-zA-Z]/g;

        if (regExp.test(command)) bot.commands.get(modules.cmdList.helpCmd).execute(Discord, bot, msg, args);

        return;
    };

    try {
        bot.commands.get(command).execute(Discord, bot, msg, args);
    }

    catch (error) {
        console.error(error);

        errorEmbed = new Discord.MessageEmbed()
            .setColor(modules.constObj.error)
            .setAuthor(bot.user.tag, bot.user.avatarURL())
            .setDescription(`**Error executing ${command} :c**`)
            .setFooter(`${dateFormat(msg.createdAt.toString(), modules.constObj.dateOutput)}`);

        bot.channels.cache.get(modules.constObj.debugID).send(errorEmbed);
    };
};

function onMemberAdd(member) {
    if (member.user.bot) return;
    
    const visitorRole = member.guild.roles.cache.find(role => role.id === modules.constObj.visitorID);
    member.roles.add(visitorRole);

    welcomeEmbed = new Discord.MessageEmbed()
        .setColor(modules.constObj.yellow)
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setDescription(`**${member.user} has just entered ${member.guild.channels.cache.get(modules.constObj.newMembersID)}.**\nMake them feel welcome!`)
        .setFooter(`${dateFormat(member.joinedAt.toString(), modules.constObj.dateOutput)}`);
    member.guild.channels.cache.get(modules.constObj.recruitingID).send(welcomeEmbed);

    logEmbed = new Discord.MessageEmbed()
        .setColor(modules.constObj.success)
        .setAuthor('Member Joined', member.user.displayAvatarURL())
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(`${member.user} ${member.user.tag}`)
        .addField('Account Age', modules.formatAge(Date.now() - member.user.createdAt))
        .setFooter(`ID: ${member.user.id} | ${dateFormat(Date(), modules.constObj.dateOutput)}`);
    member.guild.channels.cache.get(modules.constObj.logID).send(logEmbed);
};

function onMemberRemove(member) {
    logEmbed = new Discord.MessageEmbed()
        .setColor(modules.constObj.success)
        .setAuthor('Member Left', member.user.displayAvatarURL())
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(`${member.user} ${member.user.tag}`)
        .addField('Roles', modules.rolesOutput(member.roles.cache.array(), true))
        .setFooter(`ID: ${member.user.id} | ${dateFormat(Date(), modules.constObj.dateOutput)}`);
    member.guild.channels.cache.get(modules.constObj.logID).send(logEmbed);
}

function onMemberUpdate(oldMember, newMember) {
    var removedRole = null;
    var addedRole = null;
    var oldNickname = null;
    var newNickname = null;

    var roleDifference = newMember.roles.cache.difference(oldMember.roles.cache);

    if (roleDifference.first()) {
        if (newMember.roles.cache.some(role => role.id === roleDifference.first().id)) {
            addedRole = roleDifference;

            logEmbed = new Discord.MessageEmbed()
                .setDescription(`**${newMember.user} was added to** ${roleDifference.first()}`)
        }

        else if (oldMember.roles.cache.some(role => role.id === roleDifference.first().id)) {
            removedRole = roleDifference;

            logEmbed = new Discord.MessageEmbed()
                .setDescription(`**${newMember.user} was removed from** ${roleDifference.first()}`)
        }
    }

    if (newMember.displayName !== oldMember.displayName) {
        oldNickname = oldMember.displayName;
        newNickname = newMember.displayName;

        logEmbed = new Discord.MessageEmbed()
            .setDescription(`**${newMember.user} Nickname changed**`)
            .addField('Before', oldNickname)
            .addField('After', newNickname)
    }

    logEmbed.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL());
    logEmbed.setColor(modules.constObj.yellow);
    logEmbed.setFooter(`ID: ${newMember.user.id} | ${dateFormat(Date(), modules.constObj.dateOutput)}`);
    newMember.guild.channels.cache.get(modules.constObj.logID).send(logEmbed);
};

function onMessageDelete(msg) {
    logEmbed = new Discord.MessageEmbed()
        .setColor(modules.constObj.error)
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setDescription(`**Message sent by ${msg.author} deleted in ${msg.channel}**\n${msg.content}`)
        .setFooter(`Author: ${msg.author.id} | Message: ${msg.id} | ${dateFormat(Date(), modules.constObj.dateOutput)}`);
    msg.guild.channels.cache.get(modules.constObj.logID).send(logEmbed);
};

function onBulkDelete(msgs) {
    logEmbed = new Discord.MessageEmbed()
        .setColor(modules.constObj.error)
        .setAuthor(msgs.first().guild.name, msgs.first().guild.iconURL())
        .setDescription(`**${msgs.array().length} messages bulk deleted in ${msgs.first().channel}**`)
        .setFooter(`${dateFormat(Date(), modules.constObj.dateOutput)}`);
    msgs.first().guild.channels.cache.get(modules.constObj.logID).send(logEmbed);
};

function onVoiceUpdate(oldState, newState) {
    let oldID;
    let newID;
    if (oldState.channel) oldID = oldState.channelID;
    if (newState.channel) newID = newState.channelID;

    for (let i = 0; i < pairs.length; i++) {
        const textChannel = newState.guild.channels.cache.get(pairs[i].text);
        if (!textChannel) {
            console.log('Invalid text channel ID in JSON.');
            continue;
        }

        const vcID = pairs[i].voice;

        if (oldID !== vcID && newID === vcID) {
            textChannel.updateOverwrite(newState.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true })
                .catch(console.error);

            joinEmbed = new Discord.MessageEmbed()
                .setColor(modules.constObj.success)
                .setAuthor(newState.member.displayName, newState.member.user.displayAvatarURL())
                .setDescription(`${newState.member} has joined the channel.`)
                .setFooter(`${dateFormat(Date.now(), modules.constObj.dateOutput)}`);
            textChannel.send(joinEmbed);
        } 

        else if (oldID === vcID && newID !== vcID) {
            textChannel.updateOverwrite(newState.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false })
                .catch(console.error);

            leaveEmbed = new Discord.MessageEmbed()
                .setColor(modules.constObj.error)
                .setAuthor(newState.member.displayName, newState.member.user.displayAvatarURL())
                .setDescription(`${newState.member} has left the channel.`)
                .setFooter(`${dateFormat(Date.now(), modules.constObj.dateOutput)}`);
            textChannel.send(leaveEmbed);

            if (oldState.channel.members.size === 0) {
                purgeEmbed = new Discord.MessageEmbed()
                    .setTitle('Purge Text Channel')
                    .setColor(modules.constObj.success)
                    .setDescription(`Click on the ${newState.guild.emojis.cache.find(emoji => emoji.name === modules.constObj.successEmoji)} reaction to purge this channel.`);
                textChannel.send(purgeEmbed).then(msg => {
                    msg.react(newState.guild.emojis.cache.find(emoji => emoji.name === modules.constObj.successEmoji));

                    const filter = (reaction, user) => {
                        return reaction.emoji.name === modules.constObj.successEmoji;
                    };

                    const collector = msg.createReactionCollector(filter, { time: 60000, dispose: true });

                    collector.on('collect', (reaction, user) => {
                        if (msg.guild.members.cache.get(user.id).roles.cache.some(roles=>modules.constObj.adjPlus.includes(roles.id))) {
                            msg.channel.messages.fetch({ limit: 100 })
                                .then((messages) => {
                                    msg.channel.bulkDelete(messages).catch(error => console.log(error.stack));
                                    collector.stop();
                                });
                        }
                        
                        else if (!user.bot) {
                            errorEmbed = new Discord.MessageEmbed()
                                .setColor(modules.constObj.error)
                                .setAuthor(newState.member.displayName, newState.member.user.displayAvatarURL())
                                .setDescription(`${user} Insufficient permissions. ${helpObj.errorPurge}`);
                            textChannel.send(errorEmbed);
                        }
                    });

                    collector.on('remove', (reaction, user) => {
                        if (msg.guild.members.cache.get(user.id).roles.cache.some(roles=>modules.constObj.adjPlus.includes(roles.id))) {
                            msg.channel.messages.fetch({ limit: 100 })
                                .then((messages) => {
                                    msg.channel.bulkDelete(messages).catch(error => console.log(error.stack));
                                    collector.stop();
                                });
                        }
                    });

                    collector.on('end', (collected, reason) => {
                        if (reason === 'time') {
                            msg.reactions.removeAll();
                            timeEmbed = new Discord.MessageEmbed()
                                .setColor(modules.constObj.error)
                                .setAuthor(bot.user.tag, bot.user.avatarURL())
                                .setDescription(`Timed out. Type \`${modules.constObj.prefix}${cmdList.purgeCmd} 100\` to clear this channel manually.`);
                            textChannel.send(timeEmbed);
                        }
                    });
                });

            }
        }
    }
};

function onDevInfo(info, type) {
    console.log(`${type}: ${info}`);

    if (type === 'Error') {
        devEmbed = new Discord.MessageEmbed()
            .setColor(modules.constObj.error)
            .setAuthor(bot.user.tag, bot.user.avatarURL())
            .setDescription(`${type}: Check the logs!`)
            .setFooter(`${dateFormat(Date.now(), modules.constObj.dateOutput)} | Pronto v${modules.constObj.version}`);
        bot.users.cache.get(modules.constObj.devID).send(devEmbed);
    };
};