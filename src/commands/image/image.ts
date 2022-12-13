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
            name: 'rip',
            description: 'F in the chat.',
            options: [
                {
                    type: 'USER',
                    name: 'user',
                    description:'RIP <user>.',
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
            name: 'slap',
            description: ' Batman slapping.',
            options: [
                {
                    type: 'USER',
                    required: true,
                    name: 'user',
                    description:'User to slap.',
                }
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'poop',
            description: 'Ew, I stepped in poop.',
            options: [
                {
                    type: 'USER',
                    required: true,
                    name: 'user',
                    description:'User.',
                }
            ],
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
                    description: 'User to generate a namecard for.'
                },
                {
                    type: 'STRING',
                    name: 'signature',
                    description: 'The signature of the namecard.'
                },
            ],
           
        }
    ],
    run: async({interaction}) => {
        const target = interaction.options.getUser('user') || interaction.user
        const avatar = target.displayAvatarURL({size: 512, format: "png"})

        await interaction.deferReply()
        let image: Buffer

        switch (interaction.options.getSubcommand()) {
            default: {
                image = await CVC.Canvas[interaction.options.getSubcommand()](avatar)
            }

            case 'gay': {
                image = await CVC.Canvas.rainbow(avatar);
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

            case 'slap': {
                const iuserimg = interaction.user.displayAvatarURL({size: 512, format: "png"})
                image = await CVC.Canvas.slap(iuserimg, avatar)
                break
            }


            case 'poop': {
                image = await CVC.Canvas.shit(avatar)
                break
            }

            case 'namecard': {
                const user = interaction.options.getUser('user') || interaction.user
                
                const avatar = user.displayAvatarURL({dynamic: false, format: 'png'})
                const birthday = interaction.options.getString('birthday')
                let description = interaction.options.getString('signature')
        
                let query = `avatar=${avatar}&birthday=${birthday}&username=${user.username}`
                if (description) {
                    description = description.split(' ').join('%20')
                    query = query + `&description=${description}`
                }
                
                const url = `https://some-random-api.ml/canvas/misc/namecard?${query}`
                const embed: MessageEmbed = new MessageEmbed()
                    .setColor('#2f3136')
                    .setImage(url)
                return interaction.editReply({embeds: [embed]})
            }
        }
        
        let attachment = new MessageAttachment(image, 'image.gif')
        await interaction.editReply({files:[attachment]})
    }
})