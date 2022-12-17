import { MessageEmbed, TextChannel } from "discord.js";
import { ShinanoInteraction } from "../../../../../typings/Command";
import News from '../../../../../schemas/ALNews'

export async function azurLaneNewsStart(interaction: ShinanoInteraction) {
    // Permission Check
    await interaction.deferReply()

    const guildUserPerms = (await interaction.guild.members.fetch(interaction.user)).permissions
    if (!guildUserPerms.has('ADMINISTRATOR') && !guildUserPerms.has('MANAGE_WEBHOOKS')) {
        const noPerm: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('❌ | You need `Manage Webhooks` permission to use this command!')
        return interaction.editReply({embeds: [noPerm]})
    }


    const channel = interaction.options.getChannel('channel') || interaction.channel
    if (!interaction.guild.me.permissionsIn(channel as TextChannel).has("SEND_MESSAGES")) {
        const noPerm: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('❌ | Shinano does not have permission to send message in this channel')
        return interaction.reply({embeds: [noPerm]})
    }

    
    // Main
    const dbChannel = await News.findOne({guildId: interaction.guild.id})
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