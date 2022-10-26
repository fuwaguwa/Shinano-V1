import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";
import Collection from '../../../../schemas/PrivateCollection'

export async function nsfwPrivateFanbox(interaction: ShinanoInteraction, lewdEmbed: MessageEmbed) {
    const tags = ['elf', 'genshin', 'kemonomimi', 'shipgirls', 'undies', 'misc', 'uniform']
    const tag = tags[Math.floor(Math.random() * tags.length)]

    const data = await Collection.findOne({type: tag})

    const response: string[] = []
    data.links.forEach(submission => {
        if (submission.link.endsWith('_FANBOX.jpg')) response.push(submission.link)
    })

    const link = response[Math.floor(Math.random() * response.length)]
    
    lewdEmbed.setImage(link)
    const imageLink = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle('LINK')
                .setEmoji('🔗')
                .setLabel('High-Res Link')
                .setURL(link)
        )
    return interaction.editReply({embeds: [lewdEmbed], components: [imageLink]})
}