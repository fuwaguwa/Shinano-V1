import { Command } from "../../structures/Command";
import { MessageEmbed, User } from "discord.js";
import fetch from 'node-fetch'

export default new Command({
    name: 'kiss',
    description: 'Kiss someone.',
    cooldown: 4500,
    options: [
        {
            name: 'target',
            description: 'The person you want to kiss.',
            type: 'USER'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()
        const target: User = interaction.options.getUser('target')
        const response = await fetch('https://waifu.pics/api/sfw/kiss', {
            method: "GET"
        })
        const rep = await response.json()
        
        const embed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${
                target
                    ? `${interaction.user} kissed ${target}!`
                    : `You kissed yourself...how?`
            }`)
            .setImage(rep.url)
        await interaction.editReply({embeds:[embed]})
    }
})