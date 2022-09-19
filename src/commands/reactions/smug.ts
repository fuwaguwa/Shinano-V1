import { Command } from "../../structures/Command";
import { MessageEmbed, User } from "discord.js";
import fetch from 'node-fetch'

export default new Command({
    name: 'smug',
    description: 'Smug.',
    cooldown: 4500,
    run: async({interaction}) => {
        await interaction.deferReply()
        const response = await fetch('https://waifu.pics/api/sfw/smug', {
            method: "GET"
        })
        const rep = await response.json()
        
        const embed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${interaction.user} smugged!`)
            .setImage(rep.url)
        await interaction.editReply({embeds:[embed]})
    }
})