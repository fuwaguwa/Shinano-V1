import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { MessageEmbed, User } from "discord.js";

export default new Command({
    name: 'stare',
    description: '👀',
    cooldown: 4500,
    category: 'Reactions',
    options: [
        {
            type: 'USER',
            name: 'target',
            description: 'The person you want to stare at.'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()

        const target: User = interaction.options.getUser('target')

        const response = await fetch('https://nekos.best/api/v2/stare')
        const stare = await response.json()

        const stareEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${
                target
                    ? `${interaction.user} is staring at ${target}...`
                    : `You are staring at yourself...`
            }`)
            .setImage(stare.results[0].url)

        await interaction.editReply({embeds: [stareEmbed]})
    }
})