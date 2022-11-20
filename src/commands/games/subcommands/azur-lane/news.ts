import { ShinanoInteraction } from "../../../../typings/Command";
import News from '../../../../schemas/ALNews'
import { MessageEmbed } from "discord.js";

export async function azurLaneNews(interaction: ShinanoInteraction) {
    // Permission Check
    await interaction.deferReply()
    const guildUserPerms = (await interaction.guild.members.fetch(interaction.user)).permissions
    if (!guildUserPerms.has('ADMINISTRATOR') && !guildUserPerms.has('MANAGE_WEBHOOKS')) {
        const noPerm: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('❌ | You need `Manage Webhooks` permission to use this command!')
        return interaction.editReply({embeds: [noPerm]})
    }

    
    // Main
    const channel = interaction.options.getChannel('channel') || interaction.channel
    const turnedOff = interaction.options.getBoolean('stop')


    // Check for removal
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

    
    // Check for adding
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