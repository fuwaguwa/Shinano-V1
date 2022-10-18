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
        await interaction.deferReply()

        const word = interaction.options.getString('word')
        const response = await fetch(`https://api.urbandictionary.com/v0/define?term=${word}`, {
            method:"GET"
        })
        const definition = await response.json()
        
        
        // No Result
        if (definition.list.length == 0) {
            const noResult: MessageEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription(`❌ | No definition for the word \`${word}\` can be found!`)
            return interaction.editReply({embeds: [noResult]})
        }


        // Outputting Definition
        const wordInfo = definition.list[0]
        const definitionEmbed: MessageEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`"${wordInfo.word}"`)
            .addField('Definition', wordInfo.definition)
            .setFooter({text: `Defintion by ${wordInfo.author} | ${wordInfo.thumbs_up} 👍 /  ${wordInfo.thumbs_down} 👎`})
        await interaction.editReply({embeds: [definitionEmbed]})
    }
})