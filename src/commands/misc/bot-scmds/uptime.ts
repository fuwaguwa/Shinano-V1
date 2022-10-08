import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { ShinanoInteraction } from "../../../typings/Command";

export async function botUptime(interaction: ShinanoInteraction) {
    const supportEmbed: MessageEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setDescription('If you got any issue with the bot, please contact us in the support server down below!')
    const supportButton: MessageActionRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle('LINK')
                .setLabel('Support Server')
                .setEmoji('⚙️')
                .setURL('https://discord.gg/NFkMxFeEWr')
        )
    await interaction.reply({embeds: [supportEmbed], components: [supportButton]})
}