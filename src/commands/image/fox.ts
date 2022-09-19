import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { MessageEmbed } from "discord.js";

export default new Command({
    name: 'fox',
    cooldown: 4500,
    description: 'Show you a picture of a fox!',
    run: async({interaction}) => {
        await interaction.deferReply()
        const response = await fetch('https://some-random-api.ml/img/fox', {
            method: "GET"
        })
        const fox = await response.json()

        const foxEmbed = new MessageEmbed()
            .setDescription('Found a fox 🦊!')
            .setColor('RANDOM')
            .setImage(`${fox.link}`)
        await interaction.editReply({embeds:[foxEmbed]})
    }
})