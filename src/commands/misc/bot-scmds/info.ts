import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { ShinanoInteraction } from "../../../typings/Command";

export async function botInfo(interaction: ShinanoInteraction) {
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
}