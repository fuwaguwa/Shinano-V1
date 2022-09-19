import { User } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: 'id',
    description:'Get your own ID or an user\'s ID.',
    cooldown: 4500,
    options: [
        {
            name: 'user',
            description:'User.',
            type:'USER'
        }
    ],
    run: async({interaction}) => {
        const user : User = interaction.options.getUser('user') || interaction.user
        await interaction.reply({content: `${user.id}`})
    }
})