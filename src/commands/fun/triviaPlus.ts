import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { ButtonInteraction, InteractionCollector, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export default new Command({
    name: 'trivia',
    description: 'Trivia Questions!',
    options: [
        {
            required: true,
            type: 'STRING',
            name: 'category',
            description: 'Category of the trivia question.',
            choices: [
                {name: 'Random Category', value: 'random'},
                {name: 'Arts and Literature', value: 'arts_and_literature'},
                {name: 'Film and TV', value: 'film_and_tv'},
                {name: 'Food and Drink', value: 'food_and_drink'},
                {name: 'General Knowledge', value: 'general_knowledge'},
                {name: 'Geography', value: 'geography'},
                {name: 'History', value: 'history'},
                {name: 'Music', value: 'music'},
                {name: 'Science', value: 'science'},
                {name: 'Society and Culture', value: 'society_and_culture'},
                {name: 'Sport and Leisure', value: 'sport_and_leisure'}
            ]
        },
        {
            required: true,
            type: 'STRING',
            name: 'difficulty',
            description: 'Difficulty of the question.',
            choices: [
                {name: 'Random Difficulty', value: 'random'},
                {name: 'Easy', value: 'easy'},
                {name: 'Medium', value: 'medium'},
                {name: 'Hard', value: 'hard'}
            ]
        }
    ],
    cooldown: 5000,
    run: async({interaction}) => {

        const categoryChoice: string = interaction.options.getString('category')
        const difficultyChoice: string = interaction.options.getString('difficulty')
        await interaction.deferReply()

        var category = categoryChoice
        if (categoryChoice === 'random') {
            const all_category = [
                'arts_and_literature',
                'film_and_tv',
                'food_and_drink',
                'general_knowledge',
                'geography',
                'history',
                'music',
                'science',
                'society_and_culture',
                'sport_and_leisure'
            ]
            var category = all_category[Math.floor(Math.random() * all_category.length)]
        }


        var difficulty = difficultyChoice
        if (difficultyChoice === 'random') {
            const all_diff = [
                'easy',
                'medium',
                'hard'
            ]
            var difficulty = all_diff[Math.floor(Math.random() * all_diff.length)]
        }


        var response = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&limit=1&difficulty=${difficulty}`, {method:"GET"})
        var trivia = await response.json()
        console.log(`Trivia Answer: ${trivia[0]['correctAnswer']}`)


        var answers = [
            trivia[0]['correctAnswer'],
            trivia[0]['incorrectAnswers'][0],
            trivia[0]['incorrectAnswers'][1],
            trivia[0]['incorrectAnswers'][2],
        ]
        

        while (answers[0].length > 60 || answers[1].length > 60 || answers[2].length > 60 || answers[3].length > 60) {
            var response = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&limit=1&difficulty=${difficulty}`, {method:"GET"})
            var trivia = await response.json()
            console.log(`Trivia Answer: ${trivia[0]['correctAnswer']}`)

            var answers = [
                trivia[0]['correctAnswer'],
                trivia[0]['incorrectAnswers'][0],
                trivia[0]['incorrectAnswers'][1],
                trivia[0]['incorrectAnswers'][2],
            ]
        }

        
        var randchoice = []
        while (randchoice.length < 4) {
            var r = Math.floor(Math.random() * 4)
            if (randchoice.indexOf(r) === -1) randchoice.push(r)
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel(`${answers[randchoice[0]]}`)
                    .setStyle('PRIMARY')
                    .setCustomId(`${answers[randchoice[0]]}-${interaction.user.id}`),
                new MessageButton()
                    .setLabel(`${answers[randchoice[1]]}`)
                    .setStyle('PRIMARY')
                    .setCustomId(`${answers[randchoice[1]]}-${interaction.user.id}`),
                new MessageButton()
                    .setLabel(`${answers[randchoice[2]]}`)
                    .setStyle('PRIMARY')
                    .setCustomId(`${answers[randchoice[2]]}-${interaction.user.id}`),
                new MessageButton()
                    .setLabel(`${answers[randchoice[3]]}`)
                    .setStyle('PRIMARY')
                    .setCustomId(`${answers[randchoice[3]]}-${interaction.user.id}`)
            )

        
        const question = new MessageEmbed()
            .setAuthor({iconURL: interaction.user.displayAvatarURL({dynamic:true}), name: `${interaction.user.username}'s Trivia Question:`})
            .setDescription(`${trivia[0]['question']}\u200b\n\u200b`)
            .setColor('RANDOM')
            .addFields(
                {name:'Difficulty',value:`${trivia[0]['difficulty'].toUpperCase()}`, inline: true},
                {name:'Category', value:`${trivia[0]['category'].toUpperCase()}`, inline:true}
            )
            .setFooter({text:'You have 15s to pick an answer!', iconURL:`${interaction.user.displayAvatarURL({dynamic:true})}`})
        const message = await interaction.editReply({embeds:[question], components:[row]})
        

        const collector: InteractionCollector<ButtonInteraction> = await (message as Message).createMessageComponentCollector({componentType:'BUTTON', time: 15000})
        collector.on('collect', async (i) => {
            const answer = i.customId.split('-')

            if (!i.customId.endsWith(i.user.id)) {
                return i.reply({
                    content: 'This button is not for you!',
                    ephemeral: true
                })
            }

            await i.deferUpdate()
            if (answer[0] === trivia[0]['correctAnswer']) {
                for (let i = 0; i < 4; i++) {
                    if ((row.components[i] as MessageButton).customId.split('-')[0] === trivia[0]['correctAnswer']) {
                        (row.components[i] as MessageButton).setStyle('SUCCESS')
                    } else {
                        (row.components[i] as MessageButton).setStyle('SECONDARY')
                    }
                    (row.components[i] as MessageButton).setDisabled(true)
                }
                question.setColor('GREEN')
                collector.stop('End.')
                await i.editReply({components:[row], embeds:[question], content: 'You\'re correct!'})

            } else {
                const id = answer[0]
                for (let i = 0; i < 4; i++) {
                    switch (true) {
                        case ((row.components[i] as MessageButton).customId.split('-')[0] === trivia[0]['correctAnswer']):
                            (row.components[i] as MessageButton).setStyle('SUCCESS')
                            break
                        case ((row.components[i] as MessageButton).customId.split('-')[0] === id):
                            (row.components[i] as MessageButton).setStyle('DANGER')
                            break 
                        default:
                            (row.components[i] as MessageButton).setStyle('SECONDARY')
                            break
                    }
                    (row.components[i] as MessageButton).setDisabled(true)
                }

                question.setColor('RED')
                collector.stop('End.')
                await i.editReply({components:[row], embeds:[question], content: `That was incorrect, the answer was \`${trivia[0]['correctAnswer']}\`.`})
                
            }
            
        })

        collector.on('end', async (collected, reason) => {
            if (reason && reason !== 'End.') {
                for (let i = 0; i < 4; i++) {
                    (row.components[i] as MessageButton).customId.split('-')[0] === trivia[0]['correctAnswer']
                        ? (row.components[i] as MessageButton).setStyle('SUCCESS')
                        : (row.components[i] as MessageButton).setStyle('SECONDARY');
                    (row.components[i] as MessageButton).setDisabled(true)
                }

                question.setColor('RED')
                question.setFooter({text:'Timed out!', iconURL:`${interaction.user.displayAvatarURL({dynamic:true})}`})
                await interaction.editReply({components:[row], embeds:[question], content: `Timed out! The answer was \`${trivia[0]['correctAnswer']}\`.`})
            }
        })

    }
})