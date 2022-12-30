import { Command } from '../../structures/Command'
import fetch from 'node-fetch'
import { MessageEmbed } from 'discord.js'

export default new Command({
    name: 'highfive',
    description: 'Highfive!',
    cooldown: 4500,
    options: [
        {
            type: 'USER',
            name: 'target',
            description: 'The person you want to highfive!'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()

        const target = interaction.options.getUser('target')
        
        const response = await fetch('https://nekos.best/api/v2/highfive')
        const highfive = await response.json()

        const highfiveEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${
                target
                    ? `${interaction.user} highfived ${target}!`
                    : `You highfived with yourself...`
            }`)
            .setImage(highfive.results[0].url)

        await interaction.editReply({embeds: [highfiveEmbed]})
    }
})