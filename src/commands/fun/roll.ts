import { Command } from "../../structures/Command";

export default new Command({
    name: 'roll',
    description: 'Roll a random number with the set range.',
    cooldown: 4500,
    category: 'Fun',
    options: [
        {
            name: 'range',
            description: 'Number range.',
            required: true,
            type: 'INTEGER'
        }
    ],
    run: async({interaction}) => {
        const range = interaction.options.getInteger('range')
        const dice = Math.floor(Math.random() * range)
        await interaction.reply({content:`You rolled: ${dice}`})
    }
})