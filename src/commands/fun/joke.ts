import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { MessageEmbed } from "discord.js";

export default new Command({
    name: 'joke',
    description: 'Tell you a joke, may not be funny.',
    cooldown: 4500,
    run: async({interaction}) => {
        await interaction.deferReply()

        const response = await fetch('https://some-random-api.ml/others/joke', {method: "GET"})
        const jk = await response.json()

        const jokeEmbed: MessageEmbed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(jk.joke)

        await interaction.editReply({embeds: [jokeEmbed]})
    }
})