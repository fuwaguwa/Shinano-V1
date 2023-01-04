import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";
import Collection from '../../../../schemas/PrivateCollection'

export async function nsfwPrivateCollection(interaction: ShinanoInteraction, lewdEmbed: MessageEmbed, category: string) {
    const data = await Collection.findOne({type: category})
    const image = data.links[Math.floor(Math.random() * data.size)]

    if (!(image.link as string).endsWith('mp4')) {
        lewdEmbed.setImage(image.link)

        const imageLink = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setEmoji('🔗')
                    .setLabel('Image Link')
                    .setURL(image.link)
            )

        return interaction.editReply({embeds: [lewdEmbed], components: [imageLink]})
    }
    return interaction.editReply({content: image.link})
}