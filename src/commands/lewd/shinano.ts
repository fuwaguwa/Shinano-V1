import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";
import { nsfwPrivateCollection } from './subcommands/nsfw/privateColle'

export default new Command({
    name: 'shinano',
    description: '"As a reward for your valiant efforts..."',
    cooldown: 4500,
    nsfw: true,
    voteRequired: false,
    run: async({interaction}) => {
        await interaction.deferReply()
        const embed = new MessageEmbed()
            .setColor('#2f3136')
        await nsfwPrivateCollection(interaction, embed, 'shinano')
    }
})