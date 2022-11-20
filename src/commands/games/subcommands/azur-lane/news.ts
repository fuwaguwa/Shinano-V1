import { ShinanoInteraction } from "../../../../typings/Command";
import News from '../../../../schemas/ALNews'
import { MessageEmbed } from "discord.js";

export async function azurLaneNews(interaction: ShinanoInteraction) {
    // Owner Check
    if (interaction.user.id !== '836215956346634270') {
        const uhoh: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription(
                '❌ | This command is still in the testing phase, please go to [Shinano\'s Server](https://discord.gg/NFkMxFeEWr) for the latest update!'
            )
        return interaction.editReply({embeds: [uhoh]})
    }

    // Main
    await interaction.deferReply()
    const channel = interaction.options.getChannel('channel') || interaction.channel
    const turnedOff = interaction.options.getBoolean('stop')


    // Removing
    const dbChannel = await News.findOne({guildId: interaction.guild.id})
    if (turnedOff) {
        if (!dbChannel) {
            const none: MessageEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription(
                    `❌ | You haven't set-up Shinano to send news/tweets into any channel yet!`
                )
            return interaction.editReply({embeds: [none]})
        } 

        dbChannel.deleteOne({guildId: interaction.guild.id})
        const deleted: MessageEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription(
                `✅ | Shinano will no longer send news/tweets into the server!`
            )
        return interaction.editReply({embeds: [deleted]})
    }

    
    // Setting Up
    dbChannel
        ? await News.findOneAndUpdate({guildId: interaction.guild.id}, {channelId: channel.id})
        : await News.create({guildId: interaction.guild.id, channelId: channel.id})
    const done: MessageEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(
            `✅ | Shinano will now send the latest news/tweets about the game in <#${channel.id}>`
        )
    await interaction.editReply({embeds: [done]})
}