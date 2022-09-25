import { Command } from "../../structures/Command";
import { Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { client } from "../..";

export default new Command({
    name: 'bot',
    description: 'Information about the bot.',
    cooldown: 4500,
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'info',
            description: 'Show information about the bot.',
        },
        {
            type: 'SUB_COMMAND',
            name: 'stats',
            description: 'Display bot\'s stats.',
        },
        {
            type:'SUB_COMMAND',
            name: 'uptime',
            description: 'Show the bot\'s uptime.',
        },
        {
            type: 'SUB_COMMAND',
            name: 'ping',
            description: 'Show the bot\'s ping.',
        },
        {
            type: 'SUB_COMMAND',
            name: 'vote',
            description: 'Vote for the bot/Check your vote status!',
        },
        {
            type: 'SUB_COMMAND',
            name: 'support',
            description: 'Run this command if you got any problem with the bot!',
        }
    ],
    run: async({interaction}) => {
        switch (interaction.options.getSubcommand()) {
            case 'info':{
                const shinanoEmbed: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Shinano')
                    .setDescription(
                        'Shinano - The Multi-purpose Azur Lane Bot!\n' + 
                        'Developed and Maintained by **Fuwafuwa#2272**\n\n' +
                        '**APIs**: AzurAPI, Nekobot, RapidAPI, The Cat/Dog API, Some Random API, waifu.pics, nekos.fun, jikan.moe\n\n' +
                        'Liking the bot so far? Please **vote** and leave Shinano a **rating** on **top.gg**!'
                    )
                
                const buttons1: MessageActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle('LINK')
                            .setEmoji('👋')
                            .setLabel('Invite Shinano!')
                            .setURL('https://discord.com/api/oauth2/authorize?client_id=1002193298229829682&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.gg%2FNFkMxFeEWr&response_type=code&scope=bot%20applications.commands%20guilds.join'),
                        new MessageButton()
                            .setStyle('LINK')
                            .setEmoji('⚙️')
                            .setLabel('Support Server')
                            .setURL('https://discord.gg/NFkMxFeEWr')
                    )
                const buttons2: MessageActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle('LINK')
                            .setEmoji('<:topgg:1002849574517477447>')
                            .setLabel('top.gg')
                            .setURL('https://top.gg/bot/1002193298229829682'),
                        new MessageButton()
                            .setStyle('LINK')
                            .setEmoji('🤖')
                            .setLabel('discordbotlist.com')
                            .setURL('https://discord.ly/shinano'),
                        new MessageButton()
                            .setStyle('LINK')
                            .setEmoji('🔨')
                            .setLabel('discordservices.net')
                            .setURL('https://discordservices.net/bot/1002193298229829682'),
                    )
                await interaction.reply({embeds:[shinanoEmbed], components: [buttons1, buttons2]})
                break
            }

            case 'stats': {
                await interaction.deferReply()
                let totalSeconds = (client.uptime / 1000);
                totalSeconds %= 86400

                let hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = Math.floor(totalSeconds % 60);

                const memory = process.memoryUsage()
                const performance: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Shinano\'s Stats')
                    .addFields(
                        {name: 'Uptime:', value: `${hours} hours, ${minutes} minutes, ${seconds} seconds`},
                        {name: 'Latency:', value: `Latency: ${Date.now() - interaction.createdTimestamp}ms\nAPI Latency: ${Math.round(client.ws.ping)}ms`},
                        {name: 'Memory Usage:', value: 
                        `RSS: ${(memory.rss / 1024**2).toFixed(2)} MB\n` +
                        `External: ${(memory.external / 1024**2).toFixed(2)} MB\n` +
                        `Heap Total Mem: ${(memory.heapTotal / 1024**2).toFixed(2)} MB\n` +
                        `Heap Total Used: ${(memory.heapUsed / 1024**2).toFixed(2)} MB`}
                    )
                await interaction.editReply({embeds: [performance]})
                break
            }

            case 'support': {
                const supportEmbed: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription('If you got any issue with the bot, please contact us in the support server down below!')
                const supportButton: MessageActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle('LINK')
                            .setLabel('Support Server')
                            .setEmoji('⚙️')
                            .setURL('https://discord.gg/NFkMxFeEWr')
                    )
                await interaction.reply({embeds: [supportEmbed], components: [supportButton]})
                break
            }

            case 'uptime': {
                let totalSeconds = (client.uptime / 1000);
                totalSeconds %= 86400

                let hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = Math.floor(totalSeconds % 60);

                const uptimeEmbed: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Bot\'s Uptime')
                    .setDescription(`${hours} hours, ${minutes} minutes, ${seconds} seconds`)
                await interaction.reply({embeds:[uptimeEmbed]})
                break
            }

            case 'ping': {
                const pingEmbed: MessageEmbed = new MessageEmbed()
                    .setTitle('Pong 🏓')
                    .setDescription(`Latency: ${Date.now() - interaction.createdTimestamp}ms\nAPI Latency: ${Math.round(client.ws.ping)}ms`)
                    .setColor('BLUE')
                await interaction.reply({embeds:[pingEmbed]})
                break
            }

            case 'vote': {
                await interaction.deferReply()
                // Embed
                const voteEmbed: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription('You can vote for Shinano using the buttons below. Thank you for the support!\n')
                
                // Components
                const links1: MessageActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle('LINK')
                            .setLabel('Vote on top.gg')
                            .setURL('https://top.gg/bot/1002193298229829682/vote')
                            .setEmoji('<:topgg:1002849574517477447>'),
                        new MessageButton()
                            .setStyle('SECONDARY')
                            .setLabel('Check top.gg Vote')
                            .setEmoji('🔍')
                            .setCustomId('VOTE-CHECK')
                    )
                const links2: MessageActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle('LINK')
                            .setLabel('Vote on discordbotlist.com')
                            .setURL('https://discordbotlist.com/bots/shinano/upvote')
                            .setEmoji('🤖'),
                        new MessageButton()
                            .setStyle('LINK')
                            .setLabel('Vote on discordservices.net')
                            .setURL('https://discordservices.net/bot/1002193298229829682')
                            .setEmoji('🔨'),
                    )
                await interaction.editReply({embeds: [voteEmbed], components: [links1, links2]})
            }
        }
    }
})
