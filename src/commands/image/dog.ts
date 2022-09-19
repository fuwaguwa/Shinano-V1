import { Command } from "../../structures/Command"; 
import fetch from "node-fetch"
import {config} from "dotenv"
import { MessageEmbed } from "discord.js";
config();

export default new Command({
    name: 'dog',
    cooldown: 4500,
    description: 'Show you a picture of a dog!',
    run: async({interaction}) => {
        await interaction.deferReply()
        const response = await fetch('https://api.thedogapi.com/v1/images/search', {
            method:"GET",
            headers:{"X-Api-Key": process.env['dogApiKey']}
        })
        const dog = await response.json()

        const dogEmbed = new MessageEmbed()
            .setTitle('Found a dog 🐶!')
            .setColor('RANDOM')
            .setImage(dog[0].url)
        await interaction.editReply({embeds:[dogEmbed]})
    }
})