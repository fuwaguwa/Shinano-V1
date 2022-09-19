import { Command } from "../../structures/Command";
import { MessageEmbed, User } from "discord.js";
import fetch from 'node-fetch'

export default new Command({
    name: 'wink',
    description: 'Wink at someone.',
    cooldown: 4500,
    options: [
        {
            name: 'target',
            description: 'The person you want to wink at.',
            type: 'USER'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()
        const target: User = interaction.options.getUser('target')
        const response = await fetch('https://waifu.pics/api/sfw/wink', {
            method: "GET"
        })
        const rep = await response.json()
        
        const embed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${
                target
                    ? `${interaction.user} winked at ${target}!`
                    : `${interaction.user} winked!`
            }`)
            .setImage(rep.url)
        await interaction.editReply({embeds:[embed]})
    }
})