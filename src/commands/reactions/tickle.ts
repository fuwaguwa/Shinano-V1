import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { MessageEmbed, User } from "discord.js";

export default new Command({
    name: 'tickle',
    description: 'Tickle someone!',
    cooldown: 4500,
    category: 'Reactions',
    options: [
        {
            type: 'USER',
            name: 'target',
            description: 'The person you want to tickle.'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()

        const target: User = interaction.options.getUser('target')

        const response = await fetch('https://nekos.best/api/v2/tickle')
        const tickle = await response.json()

        const tickleEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${
                target
                    ? `${interaction.user} tickled ${target}!`
                    : `You tickled yourself...`
            }`)
            .setImage(tickle.results[0].url)

        await interaction.editReply({embeds: [tickleEmbed]})
    }
})