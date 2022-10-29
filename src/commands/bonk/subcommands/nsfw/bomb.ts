import { MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from 'node-fetch'

export async function nsfwBomb(interaction: ShinanoInteraction, lewdEmbed: MessageEmbed) {
    const response = await fetch('https://AmagiAPI.fuwafuwa08.repl.co/nsfw/bomb', {
        method: "GET",
        headers: {
            "Authorization": process.env.amagiApiKey
        }
    })
    const waifu = await response.json()


    return interaction.editReply({
        content: waifu.links.join("\n")
    })
}