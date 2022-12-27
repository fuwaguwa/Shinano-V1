import { MessageEmbed, User } from "discord.js";
import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { config } from 'dotenv'
config();

export default new Command({
    name: 'banner',
    description: 'Get an user\'s banner.',
    cooldown: 4500,
    options: [
        {
            type: 'USER',
            name: 'user',
            description: 'User.'
        }
    ],
    category: 'Utilities',
    run: async({interaction}) => {
        const user: User = interaction.options.getUser('user') || interaction.user
        
        await interaction.deferReply()
        const response = await fetch(`https://discord.com/api/v8/users/${user.id}`, {
            method: "GET",
            headers: {
                Authorization: `Bot ${process.env.botToken}`
            }
        })
        
        const received = await response.json()
        if (!received.banner) {
            const failed: MessageEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription('User does not have a banner.')
            return interaction.editReply({embeds: [failed]})
        }

        let format = 'png'
        if (received.banner.substring(0,2) === 'a_') format = 'gif';

        const banner: MessageEmbed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`${user}'s Banner`)
            .setImage(`https://cdn.discordapp.com/banners/${user.id}/${received.banner}.${format}?size=512`)
        await interaction.editReply({embeds: [banner]})
    }
})
