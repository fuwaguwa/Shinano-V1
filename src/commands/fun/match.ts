import { Command } from "../../structures/Command";
import { MessageEmbed, User } from "discord.js";

export default new Command({
    name: 'match',
    description: 'Check 2 people\'s love meter.',
    cooldown: 4500,
    category: 'Fun',
    options: [
        {
            name: 'user1',
            description: 'First Person.',
            required: true,
            type: 'USER'
        },
        {
            name: 'user2',
            description: 'Second Person.',
            required: true,
            type: 'USER'
        }
    ],
    run: async ({interaction}) => {
        const person1: User = interaction.options.getUser('user1')
        const person2: User = interaction.options.getUser('user2')

        let love = Math.round(Math.random() * 100)
        const loveIndex = Math.floor(love / 10)
        const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex)

        const loveEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle("Love Percentage 💘")
            .setDescription(`${person1} and ${person2} love percentage: ${love}%\n\n${loveLevel}`)
        await interaction.reply({embeds:[loveEmbed]})
    }
})