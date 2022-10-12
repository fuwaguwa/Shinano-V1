import { Command } from "../../structures/Command";
import { MessageEmbed, User } from "discord.js";
import fetch from 'node-fetch'

export default new Command({
    name: 'pat',
    description: 'Wave at someone',
    cooldown: 4500,
    options: [
        {
            name: 'target',
            description: 'The person you want to wave to.',
            type: 'USER'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()
        const target: User = interaction.options.getUser('target')
        const response = await fetch('https://waifu.pics/api/sfw/wave', {
            method: "GET"
        })
        const rep = await response.json()
        
        const embed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${
                target
                    ? `${interaction.user} waved to ${target}!`
                    : `You waved to yourself yourself...`
            }`)
            .setImage(rep.url)
        await interaction.editReply({embeds:[embed]})
    }
})