import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { MessageEmbed, User } from "discord.js";

export default new Command({
    name: 'punch',
    description: 'Punch someone!',
    cooldown: 4500,
    options: [
        {
            type: 'USER',
            name: 'target',
            description: 'The person you want to punch'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()

        const target: User = interaction.options.getUser('target')
        const response = await fetch('https://nekos.best/api/v2/punch')
        const punch = await response.json()

        const punchEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${
                target
                    ? `${interaction.user} punched ${target}!`
                    : `You punched yourself...`
            }`)
            .setImage(punch.results[0].url)

        await interaction.editReply({embeds: [punchEmbed]})
    }
})