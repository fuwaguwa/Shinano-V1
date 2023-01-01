import { MessageEmbed } from "discord.js";
import User from "../../../../../schemas/User";
import { ShinanoInteraction } from "../../../../../typings/Command";

export async function blacklistRemove(interaction: ShinanoInteraction) {
    const user = await User.findOne({userId: interaction.options.getUser('user').id})
    if (!user) {
        const noOne: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('User is not blacklisted!')
        return interaction.editReply({embeds: [noOne]})
    } else if (user.blacklisted == true) {
        await user.updateOne({blacklisted: false})
    } else {
        const noOne: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('User is not blacklisted!')
        return interaction.editReply({embeds: [noOne]})
    }


    const success: MessageEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`${interaction.options.getUser('user')} has been removed from the blacklist!`)
        .setTimestamp()
    await interaction.editReply({embeds: [success]})
}