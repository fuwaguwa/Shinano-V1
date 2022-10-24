import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name:'8ball',
    description:'Ask 8ball.',
    cooldown: 4500,
    options: [
        {
            required: true,
            name: 'question',
            description: 'Your Question.',
            type:'STRING',
        }
    ],
    run: async({interaction}) => {
        const responses = [
            "As I see it, yes.", 
            "Ask again later.", 
            "Better not tell you now.", 
            "Cannot predict now.", 
            "Concentrate and ask again.",
            "Don’t count on it.", 
            "It is certain.", 
            "It is decidedly so.", 
            "Most likely.", 
            "My reply is no.", 
            "My sources say no.",
            "Outlook not so good.", 
            "Outlook good.", 
            "Reply hazy, try again.", 
            "Signs point to yes.", 
            "Very doubtful.", 
            "Without a doubt.",
            "Yes.", 
            "Yes – definitely.", 
            "You may rely on it."
        ]

        const response: MessageEmbed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(
                `> **${interaction.options.getString('question')}**\n`+
                responses[Math.floor(Math.random() * responses.length)]
            )
        await interaction.reply({embeds: [response]})
    }
})