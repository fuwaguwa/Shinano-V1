import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { MessageEmbed, User } from "discord.js";

export default new Command({
    name: 'kick',
    description: 'Kick someone!',
    cooldown: 4500,
    category: 'Reactions',
    options: [
        {
            type: 'USER',
            name: 'target',
            description: 'The person you want to kick.'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()

        const target: User = interaction.options.getUser('target')

        const response = await fetch('https://nekos.best/api/v2/kick')
        const kick = await response.json()

        const kickEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${
                target
                    ? `${interaction.user} kicked ${target}!`
                    : `You kicked yourself...`
            }`)
            .setImage(kick.results[0].url)

        await interaction.editReply({embeds: [kickEmbed]})
    }
})