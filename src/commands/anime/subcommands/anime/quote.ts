import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from 'node-fetch'
import { MessageEmbed } from "discord.js";

export async function animeQuote(interaction: ShinanoInteraction) {
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