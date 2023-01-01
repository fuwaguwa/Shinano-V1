import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from 'node-fetch'

export async function shinanoVote(interaction: ShinanoInteraction) {
    await interaction.deferReply()

    // Embed
    const voteEmbed: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
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