const dateFormat = require('dateformat');
const modules = require('../modules');

module.exports = {
    name: modules.cmdList.archiveCmd,
    description: modules.cmdTxt.archiveDesc,
    execute(Discord, bot, msg, args) {
        if (!msg.member.roles.cache.some(roles=>modules.constObj.cqmsPlus.includes(roles.id))) {
            bot.commands.get(modules.cmdList.helpCmd).execute(Discord, bot, msg, args);
            return;
        }

        if (msg.mentions.channels.size === 0) {
            modules.sendErrorEmbed(Discord, bot, msg, 'You must specify a text channel.', modules.helpObj.errorArchive);
        }

        else if (msg.mentions.channels.some(mention => mention.type !== 'text')) {
            modules.sendErrorEmbed(Discord, bot, msg, 'You can only archive text channels.', modules.helpObj.errorArchive);
        }

        else if (msg.mentions.channels.size > 1) {
            modules.sendErrorEmbed(Discord, bot, msg, 'You must archive channels individually.', modules.helpObj.errorArchive);
        }

        else if (bot.channels.cache.get(msg.mentions.channels.first().id).parentID === modules.constObj.archivedID) {
            modules.sendErrorEmbed(Discord, bot, msg, 'Channel is already archived.', modules.helpObj.errorArchive);
        }

        else {
            msg.react(msg.guild.emojis.cache.find(emoji => emoji.name === modules.constObj.successEmoji));

            msg.mentions.channels.first().setParent(modules.constObj.archivedID, { lockPermissions: true })
                .catch(console.error);

            archiveEmbed = new Discord.MessageEmbed()
                .setTitle('Channel Archived 🔒')
                .setColor(modules.constObj.error)
                .setAuthor(msg.member.displayName, msg.author.displayAvatarURL())
                .setFooter(`${dateFormat(msg.createdAt, modules.constObj.dateOutput)}`);
            bot.channels.cache.get(msg.mentions.channels.first().id).send(archiveEmbed);

            logEmbed = new Discord.MessageEmbed()
                .setColor(modules.constObj.yellow)
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
                .setDescription(`**Channel ${msg.mentions.channels.first()} archived by ${msg.author}**`)
                .setFooter(`User: ${msg.author.id} | Channel: ${msg.mentions.channels.first().id} | ${dateFormat(msg.createdAt, modules.constObj.dateOutput)}`);
            bot.channels.cache.get(modules.constObj.logID).send(logEmbed);
        }
    },
};