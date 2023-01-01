import { MessageEmbed } from "discord.js";
import User from "../../../../../schemas/User";
import { ShinanoInteraction } from "../../../../../typings/Command";

export async function blacklistAdd(interaction: ShinanoInteraction) {
    const user = await User.findOne({userId: interaction.options.getUser('user').id})
    if (!user) {
        await User.create({
            userId: interaction.options.getUser('user').id,
            commandsExecuted: 0,
            blacklisted: true
        })
    }  else if (user.blacklisted == true) {
        const noOne: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`${interaction.options.getUser('user')} has already been blacklisted!`)
        return interaction.editReply({embeds: [noOne]})
    } else {
        await user.updateOne({blacklisted: true})
    }


    const success: MessageEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`${interaction.options.getUser('user')} has been added to blacklist!`)
        .addFields(
            {name: 'User ID', value: interaction.options.getUser('user').id},
        )
        .setTimestamp()
    await interaction.editReply({embeds: [success]})
}