import { MessageEmbed } from "discord.js";
import Blacklist from "../../../../../schemas/Blacklist";
import { ShinanoInteraction } from "../../../../../typings/Command";

export async function blacklistAdd(interaction: ShinanoInteraction) {
    const blacklist = await Blacklist.findOne({userId: interaction.options.getUser('user').id})
    if (!blacklist) {
        try {
            await Blacklist.create({
                blacklistedBy: interaction.user.id,
                userId: interaction.options.getUser('user').id,
                reason: interaction.options.getString('reason')
            })

            const success: MessageEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${interaction.options.getUser('user')} has been added to blacklist!`)
                .addFields(
                    {name: 'Reason:', value: interaction.options.getString('reason')},
                    {name: 'User ID', value: interaction.options.getUser('user').id},
                    {name: 'Blacklisted By:', value: `${interaction.user}`},
                )
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
            .setDescription(`${interaction.options.getUser('user')} has already been blacklisted!`)
            .addFields(
                {name: 'Reason:', value: blacklist['reason']},
                {name: 'Blacklisted By:', value: `<@${blacklist['blacklistedBy']}>`}
            )
        await interaction.editReply({embeds: [noOne]})
    }
}