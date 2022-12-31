import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { MessageEmbed } from "discord.js";

export default new Command({
    name: 'sleep',
    description: 'Oyasumi...',
    cooldown: 4500,
    category: 'Reactions',
    run: async({interaction}) => {
        await interaction.deferReply()

        const response = await fetch('https://nekos.best/api/v2/sleep')
        const sleep = await response.json()

        const sleepEmbed: MessageEmbed = new MessageEmbed()
            .setDescription(`${interaction.user} is sleeping...`)
            .setColor('RANDOM')
            .setImage(sleep.results[0].url)

        await interaction.editReply({embeds: [sleepEmbed]})
    }
})