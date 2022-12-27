import { Command } from "../../structures/Command";
import { MessageAttachment, MessageEmbed } from "discord.js";
import Canvacord from "canvacord"
import Canvas from "canvas"
import { config } from 'dotenv'
config()


const CVC: any = Canvacord
Canvas.registerFont(`Upright.otf`, {family: 'Upright'})


export default new Command({
    name: 'image',
    description: 'Image Generation + Manipulation Command!',
    cooldown: 10000,
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'bronya',
            description: 'Bronya\'s certificate.',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'text',
                    description:'Text to put on the certificate.',
                }
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'gay',
            description: 'Apply a rainbow filter to an user or yourself.',
            options: [
                {
                    type: 'USER',
                    name: 'user',
                    description:'User to turn gay.',
                }
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'jail',
            description: 'Put an user or yourself behind bars.',
            options: [
                {
                    type: 'USER',
                    name: 'user',
                    description:'User to put behind bars.',
                }
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'sigma',
            description: 'Sigma Grindset.',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'text',
                    description:'Sigma Mindset.',
                }
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'wasted',
            description: 'Wasted.',
            options: [
                {
                    type: 'USER',
                    name: 'user',
                    description:'Wasted user.',
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'triggered',
            description: 'Triggered.',
            options: [
                {
                    type: 'USER',
                    name: 'user',
                    description:'Triggered user.',
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'horni-card',
            description: 'Grant someone the horni card',
            options: [
                {
                    type: 'USER',
                    name: 'user',
                    description:'User that will get the card.',
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'simp-card',
            description: 'Give someone the simp card. Shame on them',
            options: [
                {
                    type: 'USER',
                    name: 'user',
                    description:'User that will get the card.',
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'namecard',
            description: 'Generate a Genshin namecard.',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'birthday',
                    description: 'The birthday to display on the namecard'
                },
                {
                    type: 'USER',
                    name: 'user',
                    description: 'The user on the namecard.'
                },
                {
                    type: 'STRING',
                    name: 'signature',
                    description: 'The signature of the namecard.'
                },
            ],
           
        },
        {
            type: 'SUB_COMMAND',
            name: 'comment',
            description: 'Generate a fake picture of a YouTube comment.',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'content',
                    description: 'The content of the comment.'
                },
                {
                    type: 'STRING',
                    name: 'user',
                    description: 'The author of the comment.'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'tweet',
            description: 'Generate a fake tweet.',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'display-name',
                    description: 'Display name of the tweet.'
                },
                {
                    type: 'STRING',
                    required: true,
                    name: 'content',
                    description: 'Content of the tweet.'
                },
                {
                    type: 'USER',
                    name: 'user',
                    description: 'The author of the tweet.'
                },
                {
                    type: 'INTEGER',
                    name: 'replies',
                    description: 'The number of replies.'
                },
                {
                    type: 'INTEGER',
                    name: 'retweets',
                    description: 'The number of retweets.'
                },
                {
                    type: 'INTEGER',
                    name: 'likes',
                    description: 'The number of likes.'
                },
                {
                    type: 'STRING',
                    name: 'theme',
                    description: 'Theme of the tweet.',
                    choices: [
                        {name: 'Dark Mode', value: 'dark'},
                        {name: 'Light Mode', value: 'light'}
                    ]
                }
            ]
        }
    ],
    run: async({interaction}) => {
        const target = interaction.options.getUser('user') || interaction.user
        const avatar = target.displayAvatarURL({size: 512, format: "png"})

        await interaction.deferReply()
        let image: Buffer
        let link: string

        switch (interaction.options.getSubcommand()) {
            default: {
                link = 
                `https://some-random-api.ml/canvas/overlay/${interaction.options.getSubcommand()}?avatar=${avatar}`
                break
            }

            case 'horni-card': {
                link = 
                `https://some-random-api.ml/canvas/misc/horny?avatar=${avatar}`
                break
            }

            case 'simp-card': {
                link = 
                `https://some-random-api.ml/canvas/misc/simpcard?avatar=${avatar}`
                break
            }

            case 'bronya': {
                let canvas = Canvas.createCanvas(1547, 1920)
                let context = canvas.getContext('2d')
                let background = await Canvas.loadImage('https://i.imgur.com/EH71R7O.png')

                let applyText = (canvas, text) => {
                    const context = canvas.getContext('2d');
                    let fontSize = 120;
                    do {
                        context.font = `${fontSize -= 5}px upright`;
                    } while (context.measureText(text).width > 847);
                    return context.font;
                };

                context.drawImage(background, 0, 0, canvas.width, canvas.height)
                context.font = applyText(canvas, interaction.options.getString('text'))
                context.fillStyle = '#000000'
                context.textAlign = 'center'
                context.fillText(interaction.options.getString('text'), canvas.width/2 + 5, 1485);

                image = canvas.toBuffer()
                break
            }


            case 'sigma': {
                let canvas = Canvas.createCanvas(750, 750)
                let context = canvas.getContext('2d')

                const sigmaImages = [
                    'https://i.imgur.com/G7i9yyS.jpg', 
                    'https://i.imgur.com/jEFhMKd.png', 
                    'https://i.imgur.com/MZCirY7.jpg', 
                    'https://i.imgur.com/6YvbFX5.jpg',
                    'https://i.imgur.com/LM9Tpfb.png',
                    'https://i.imgur.com/bL1sqcf.png',
                    'https://i.imgur.com/DKuRMcU.png',
                ]
                let background = await Canvas.loadImage(sigmaImages[Math.floor(Math.random() * sigmaImages.length)])

                let applyText = (canvas, text) => {
                    const context = canvas.getContext('2d')
                    let fontSize = 130
                    do {
                        context.font = `${fontSize -= 5}px upright`
                    } while (context.measureText(text).width > 720);
                    return context.font
                }

                context.drawImage(background, 0, 0, canvas.width, canvas.height)
                context.font = applyText(canvas, interaction.options.getString('text'))
                context.fillStyle = '#ffffff'
                context.strokeStyle = '#000000'
                context.lineWidth = 3.5
                context.textAlign = 'center'
                context.fillText(interaction.options.getString('text'), canvas.width/2 , canvas.height/2 + 30)
                context.strokeText(interaction.options.getString('text'), canvas.width/2, canvas.height /2 + 30)

                image = canvas.toBuffer()
                break
            }

            case 'namecard': {
                const avatar = target.displayAvatarURL({dynamic: false, format: 'png'})
                const birthday = interaction.options.getString('birthday')
                const username = target.username.split(' ').join('%20')
                let description = interaction.options.getString('signature')

                if (birthday.match(/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|[1][0-2])$/i) == null) {
                    const failed: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription('❌ | Birthday must be in `DD/MM` format!')
                    return interaction.editReply({embeds: [failed]})
                }
        
                let query = `avatar=${avatar}&birthday=${birthday}&username=${username}`
                if (description) {
                    description = description.split(' ').join('%20')
                    query +=`&description=${description}`
                }
                
                link = `https://some-random-api.ml/canvas/misc/namecard?${query}`
                break
            }

            case 'comment': {
                const content = (interaction.options.getString('content')).split(' ').join('%20')
                const username = target.username.split(' ').join('%20')
                const query = `avatar=${avatar}&username=${username}&comment=${content}`


                link = 
                `https://some-random-api.ml/canvas/misc/youtube-comment?${query}`
                break
            }

            case 'tweet': {
                const displayName = (interaction.options.getString('display-name')).split(' ').join('%20')
                const username = target.username.toLowerCase().split(' ').join('%20')
                const content = (interaction.options.getString('content')).split(' ').join('%20')
                const replies = interaction.options.getInteger('replies')
                const retweets = interaction.options.getInteger('retweets')
                const likes = interaction.options.getInteger('likes')
                const theme = interaction.options.getString('theme')

                let query = 
                `avatar=${avatar}&content=${content}&username=${username}&displayname=${displayName}&comment=${content}`
                if (replies) query += `&replies=${replies}`
                if (retweets) query += `&retweets=${retweets}`
                if (likes) query += `&likes=${likes}`
                if (theme) query += `&theme=${theme}`

                link = `https://some-random-api.ml/canvas/misc/tweet?${query}`
                break
            }
        }
        

        if (image) {
            let attachment = new MessageAttachment(image, 'image.gif')
            await interaction.editReply({files:[attachment]})
        } else {
            const embed: MessageEmbed = new MessageEmbed()
                .setColor('#2f3136')
                .setImage(link)
            await interaction.editReply({embeds: [embed]})
        }
    }
})