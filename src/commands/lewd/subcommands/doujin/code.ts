import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from 'node-fetch'
import { MessageEmbed } from "discord.js";
import { displayDoujin } from "../../../../structures/Doujin";


export async function doujinCode(interaction: ShinanoInteraction, nuclearLaunchCode?) {
    // Fetching Data
    const code = nuclearLaunchCode || interaction.options.getInteger('doujin-code')
    const response = await fetch(`${process.env.nhentaiIP}/api/gallery/${code}`, {method: "GET"})
    const doujin = await response.json()
    
    if (doujin.error) {
        const notFound: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('❌ | Doujin not found!')
        return interaction.editReply({embeds: [notFound]})
    }


    // Processing
    await displayDoujin(interaction, doujin)
}