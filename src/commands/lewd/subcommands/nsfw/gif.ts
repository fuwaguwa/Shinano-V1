import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from 'node-fetch'

export async function nsfwGif(interaction: ShinanoInteraction, lewdEmbed: MessageEmbed) {
    const gifTag: string = interaction.options.getString('gif-category')
    
    if (!gifTag) {
        const response = await fetch(`https://AmagerAPI.fuwafuwa08.repl.co/nsfw/public/gif`, {
            method: "GET",
            headers: {
                "Authorization": process.env.amagiApiKey
            }
        })
        const waifu = await response.json()
        lewdEmbed.setImage(waifu.link)
        await interaction.editReply({embeds:[lewdEmbed]})
    } else {
        const response = await fetch(`https://AmagerAPI.fuwafuwa08.repl.co/nsfw/private/${gifTag}?type=gif`, {
            method: "GET",
            headers: {
                "Authorization": process.env.amagiApiKey
            }
        })
        const waifu = await response.json()
        lewdEmbed.setImage(waifu.body.link)

        const imageLink = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setEmoji('🔗')
                    .setLabel('High-Res Link')
                    .setURL(waifu.body.link)
            )
        await interaction.editReply({embeds: [lewdEmbed], components: [imageLink]})
    }
}