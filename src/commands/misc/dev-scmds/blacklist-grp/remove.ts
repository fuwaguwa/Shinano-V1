import { MessageEmbed } from "discord.js";
import Blacklist from "../../../../schemas/Blacklist";
import { ShinanoInteraction } from "../../../../typings/Command";

export async function blacklistRemove(interaction: ShinanoInteraction) {
    const blacklist = await Blacklist.findOne({userId: interaction.options.getUser('user').id})
    if (blacklist) {
        try {
            await Blacklist.deleteOne({userId: interaction.options.getUser('user').id})

            const success: MessageEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${interaction.options.getUser('user')} has been removed from the blacklist!`)
                .setTimestamp()
            await interaction.editReply({embeds: [success]})
        } catch (error) {
            const errorEmbed: MessageEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription("An error has occur! Please check console.")
            await interaction.editReply({embeds: [errorEmbed]})
            console.error(error)
        }
    } else {
        const noOne: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('User is not blacklisted!')
        await interaction.editReply({embeds: [noOne]})
    }
}