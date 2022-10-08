import { MessageEmbed } from "discord.js";
import Blacklist from "../../../../schemas/Blacklist";
import { ShinanoInteraction } from "../../../../typings/Command";

export async function blacklistCheck(interaction: ShinanoInteraction) {
    const blacklist = await Blacklist.findOne({userId: interaction.options.getUser('user').id})
    if (blacklist) {
        const blacklisted: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle('Uh oh, user is blacklisted!')
            .addFields(
                {name: 'User:', value: `${interaction.options.getUser('user')}`},
                {name: 'Reason:', value: `${blacklist['reason']}`},
                {name: 'Blacklisted By:', value: `<@${blacklist['blacklistedBy']}>`}
            )
        await interaction.editReply({embeds:[blacklisted]})
    } else {
        const noOne: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('User is not blacklisted!')
        await interaction.editReply({embeds: [noOne]})
    }
}