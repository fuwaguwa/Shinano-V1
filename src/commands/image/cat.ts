import { Command } from "../../structures/Command";
import fetch from "node-fetch"
import {config} from 'dotenv'
import { MessageEmbed } from "discord.js";
config()

export default new Command({
    name: 'cat',
    cooldown: 4500,
    description:'Show you a picture of a cat!',
    run: async({interaction}) => {
        await interaction.deferReply()
        const response = await fetch('https://api.thecatapi.com/v1/images/search', {
            method: "GET",
            headers: {"X-Api-Key": process.env.catApiKey}
        })
        const cat = await response.json()
        const catEmbed = new MessageEmbed()
            .setTitle("Found a cat 🐱!")
            .setColor('RANDOM')
            .setImage(cat[0].url)
        await interaction.editReply({embeds:[catEmbed]})
    }
})