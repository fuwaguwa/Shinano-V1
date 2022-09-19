import { Command } from "../../structures/Command";
import { MessageEmbed } from "discord.js";
import fetch from 'node-fetch'

export default new Command({
    name: 'fact',
    cooldown: 4500,
    description: 'Send a fact about an animal.',
    options: [
        {
            required: true,
            name:'animal',
            description:'Animal.',
            choices: [
                {
                    name: 'dog',
                    value: 'dog'
                },
                {
                    name: 'cat',
                    value:'cat',
                },
                {
                    name:'fox',
                    value:'fox',
                },
                {
                    name:'bird',
                    value:'bird'
                }
            ],
            type: 'STRING'
        },
    ],
    run: async({interaction}) => {
        const choice = interaction.options.getString('animal')
        await interaction.deferReply()
        const response = await fetch(`https://some-random-api.ml/facts/${choice}`, {
            method:"GET"
        })
        const fact = await response.json()

        const factEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${fact.fact}`)
        await interaction.editReply({embeds:[factEmbed]})
    }
})