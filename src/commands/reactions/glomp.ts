import { Command } from "../../structures/Command";
import { MessageEmbed, User } from "discord.js";
import fetch from 'node-fetch'

export default new Command({
    name: 'glomp',
    description: 'Give someone an affectionate hug.',
    cooldown: 4500,
    options: [
        {
            name: 'target',
            description: 'The person you want to glomp at.',
            type: 'USER'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()
        const target: User = interaction.options.getUser('target')
        const response = await fetch('https://waifu.pics/api/sfw/glomp', {
            method: "GET"
        })
        const rep = await response.json()
        
        const embed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${
                target
                    ? `${interaction.user} glomped at ${target}!`
                    : `You glomped at yourself...lonely`
            }`)
            .setImage(rep.url)
        await interaction.editReply({embeds:[embed]})
    }
})