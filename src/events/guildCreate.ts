import { Event } from "../structures/Event";
import { Guild, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { client } from "..";
import { updateServerCount } from "../structures/Utils";
import { config } from "dotenv";
config();

export default new Event('guildCreate', async (guild) => {
    await guild.fetchAuditLogs({
        type: 'BOT_ADD',
        limit: 1
    }).then(async (log) => {
        const mainGuild: Guild = await client.guilds.fetch('1002188088942022807')
        const IOChannel = await mainGuild.channels.fetch('1017463107737628732')

        const botAdded: MessageEmbed = new MessageEmbed()
            .setImage(guild.iconURL({dynamic: true, size: 1024}))
            .setTitle('Bot Added To Server!')
            .setThumbnail(log.entries.first().executor.displayAvatarURL({dynamic: true, size: 512}))
            .addFields(
                {name: 'Guild Name | Guild ID', value: `${guild.name} | ${guild.id}`},
                {name: 'User | User ID', value: `${log.entries.first().executor.username}#${log.entries.first().executor.discriminator} | ${log.entries.first().executor.id}`}
            )
            .setTimestamp()
            .setColor('GREEN')
        await (IOChannel as TextChannel).send({embeds:[botAdded]})


        await updateServerCount();
    })



    // Join Message
    await guild.channels.cache.some((channel) => {
        if (channel.name.includes('general') || channel.name.includes('lobby') || channel.name.includes('chat')) {
            const helloEmbed: MessageEmbed = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(
                    'I am Shinano, a multi-purpose Discord bot designed to serve shikikans all over the world. ' +
                    'Whether it is providing information about shipfus, query information in Genshin, or to entertain you, I can do it all while being half-asleep...zzz\n\n' + 
                    'You can learn more about what I can do by using `/shinano help`. If you\'re experiencing any trouble with the bot, please join the support server down below!'
                )
                .setThumbnail('https://cdn.discordapp.com/avatars/1002193298229829682/14d86d9092130bb9b6dfc49af0a110b2.webp?size=1024')
            const supportServer: MessageActionRow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('LINK')
                        .setURL('https://discord.gg/NFkMxFeEWr')
                        .setLabel('Support Server')
                        .setEmoji('⚙️'),
                    new MessageButton()
                        .setStyle('LINK')
                        .setURL('https://top.gg/bot/1002193298229829682')
                        .setLabel('Top.gg')
                        .setEmoji('<:topgg:1002849574517477447>')
                );
            (async () => await (channel as TextChannel).send({embeds: [helloEmbed], components: [supportServer]}))();
            
            return true
        }
        return false
    })
})