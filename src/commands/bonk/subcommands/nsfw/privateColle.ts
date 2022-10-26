import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";
import Collection from '../../../../schemas/PrivateCollection'

export async function nsfwPrivateCollection(interaction: ShinanoInteraction, lewdEmbed: MessageEmbed, category: string) {
    const data = await Collection.findOne({type: category})
    const image = data.links[Math.floor(Math.random() * data.links.length)]

    if (!(image.link as string).endsWith('mp4')) {
        lewdEmbed.setImage(image.link)

        const imageLink = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setEmoji('🔗')
                    .setLabel('High-Res Link')
                    .setURL(image.link)
            )

        if (image.link.includes('_ellieAL_') && interaction.channelId === '1020991018507698206') return interaction.editReply({content: '<@557567996890185730>,',embeds: [lewdEmbed], components: [imageLink]})
        return interaction.editReply({embeds: [lewdEmbed], components: [imageLink]})
    }
    if (image.link.includes('_ellieAL_') && interaction.channelId === '1020991018507698206') return interaction.editReply({content: `<@557567996890185730>,\n${image.link}`})
    return interaction.editReply({content: image.link})
}