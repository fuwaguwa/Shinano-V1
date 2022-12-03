import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from 'node-fetch'

export async function nsfwVideo(interaction: ShinanoInteraction) {
    const videoCategory: string = interaction.options.getString('video-category') || 'random'

    async function videoFetch(category) {
        const response = await fetch(`https://AmagerAPI.fuwafuwa08.repl.co/nsfw/private/${category}?type=mp4`, {
            method: "GET",
            headers: {
                "Authorization": process.env.amagiApiKey
            }
        })
        
        const responseJson = await response.json()
        if (!responseJson.body) return videoFetch(videoCategory)
        return responseJson.body.link
    }
    

    await interaction.editReply({content: await videoFetch(videoCategory)}) 
}