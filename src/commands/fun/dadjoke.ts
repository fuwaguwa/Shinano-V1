import { Command } from "../../structures/Command";
import { config } from 'dotenv'
import fetch from 'node-fetch'
import { MessageEmbed } from "discord.js";
config();

export default new Command({
    name: 'dadjoke',
    cooldown: 4500,
    description: 'Make a dadjoke.',
    run: async({interaction}) => {
        await interaction.deferReply()
        const response = await fetch(`https://dad-jokes.p.rapidapi.com/random/joke`,{
            method: "GET",
            headers: {
                'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com',
                'X-RapidAPI-Key': process.env['rapidApiKey']
            }
        })
        const dadjoke = await response.json()
        const dadjokeEmbed = new MessageEmbed()
            .setDescription(`**${dadjoke.body[0].setup}**\n${dadjoke.body[0].punchline}`)
            .setColor('RANDOM')
        await interaction.editReply({embeds:[dadjokeEmbed]})
    }
})