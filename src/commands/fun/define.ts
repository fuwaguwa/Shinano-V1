import { Command } from "../../structures/Command"
import fetch from "node-fetch"
import { MessageEmbed } from "discord.js"

export default new Command({
    name: 'define',
    cooldown: 4500,
    description: 'Get a word\'s definition from Urban Dictionary.',
    options: [
        {   
            required: true,
            name: 'word',
            description:'The word you want to define.',
            type:'STRING'
        }
    ],
    run: async({interaction}) => {
        const word = interaction.options.getString('word')
        await interaction.deferReply()
        const response = await fetch(`https://api.urbandictionary.com/v0/define?term=${word}`, {
            method:"GET"
        })
        const definition = await response.json()

        if (definition['list'].length !== 0) {
            const definitionEmbed = new MessageEmbed()
                .setTitle(`"${definition['list'][0]['word']}"`)
                .setColor('BLUE')
                .addFields({name:'Definition', value:`${definition['list'][0]['definition']}`})
                .setFooter({text:`Definition by ${definition['list'][0]['author']} | ${definition['list'][0]['thumbs_up']} 👍 / ${definition['list'][0]['thumbs_down']} 👎`})
            if (definition['list'][0]['example']) {
                definitionEmbed.addField('Example', `${definition['list'][0]['example']}`)
                await interaction.editReply({embeds:[definitionEmbed]})
            } else {
                await interaction.editReply({embeds:[definitionEmbed]})
            }
        } else {
            const failedEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription('Couldn\'t find the word on Urban Dictionary.')
            await interaction.editReply({embeds:[failedEmbed]})
        }
    }
})