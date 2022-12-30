import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { MessageEmbed } from "discord.js";

export default new Command({
    name: 'think',
    description: '🤔',
    cooldown: 4500,
    run: async({interaction}) => {
        await interaction.deferReply()
            
        const response = await fetch('https://nekos.best/api/v2/think')
        const think = await response.json()

        const thinkEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${interaction.user} is thinking...`)
            .setImage(think.results[0].url)
        
        await interaction.editReply({embeds: [thinkEmbed]})
    }
})