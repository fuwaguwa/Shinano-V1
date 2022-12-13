import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { MessageEmbed } from "discord.js";

export default new Command({
    name: 'anime-quote',
    description: 'Send you an edgy, funny, motivational or straight up random anime quote.',
    cooldown: 3000,
    run: async({interaction}) => {
        await interaction.deferReply()

        const response = await fetch('https://some-random-api.ml/animu/quote', {method: "GET"})
        const quote = await response.json()

        const quoteEmbed: MessageEmbed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(
                `> *${quote.sentence}*\n\n` +
                `**${quote.character}** - *${quote.anime}*`
            )

        await interaction.editReply({embeds: [quoteEmbed]})
    }
})