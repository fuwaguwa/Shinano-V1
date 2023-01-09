import { animeInfo } from "../../../../lib/Anime";
import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from 'node-fetch'


export async function animeRandom(interaction: ShinanoInteraction) {
    // Fetching
    const response = await fetch(`https://api.jikan.moe/v4/random/anime?sfw=true`, {method: "GET"})
    const anime = (await response.json()).data

    animeInfo({anime: anime, interaction: interaction, menu: null})
}