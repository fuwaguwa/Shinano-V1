import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from 'node-fetch'

export async function nsfwBomb(interaction: ShinanoInteraction) {
    let category = interaction.options.getString('category') || 'random'
    if (category === 'gif') category = `random&type=gif`
    
    const response = await fetch(`https://AmagiAPI.fuwafuwa08.repl.co/nsfw/bomb?category=${category}`, {
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