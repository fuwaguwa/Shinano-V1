import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from 'node-fetch'

export async function nsfwVideo(interaction: ShinanoInteraction) {
    async function videoFetch() {
        const response = await fetch(`https://AmagiAPI.fuwafuwa08.repl.co/nsfw/private/random?type=mp4`, {
            method: "GET",
        })
        
        const responseJson = await response.json()
        if (!responseJson.body) return videoFetch()
        return responseJson.body.link
    }
    

    await interaction.editReply({content: await videoFetch()}) 
}