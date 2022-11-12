import { MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from 'node-fetch'

export async function nsfwRandom(interaction: ShinanoInteraction, lewdEmbed: MessageEmbed) {
    const response = await fetch('https://AmagiAPI.fuwafuwa08.repl.co/nsfw/random', {
        method: "GET",
        headers: {
            "Authorization": process.env.amagiApiKey
        }
    })
    const waifu = await response.json()

    if (!(waifu.link as string).endsWith('mp4')) {
        lewdEmbed.setImage(waifu.link)
        return interaction.editReply({embeds:[lewdEmbed]})
    }
    return interaction.editReply({content: waifu.link})
}