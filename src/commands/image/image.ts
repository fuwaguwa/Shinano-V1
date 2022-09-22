import { Command } from "../../structures/Command";
import { MessageActionRow, MessageAttachment, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import Canvacord from "canvacord"
import axios from 'axios'
import Canvas from "canvas"
import {config} from 'dotenv'
import petpet from "pet-pet-gif"
import deepAI from 'deepai'
import { client } from "../..";
config()
deepAI.setApiKey(process.env['deepAIApiKey'])

const CVC: any = Canvacord
Canvas.registerFont(`Upright.otf`, {family: 'Upright'})


export default new Command({
    name: 'image',
    description: 'Image Manipulation.',
    cooldown: 10000,
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'upscale',
            description: 'Upscale an image using DeepAI!',
            options: [
                {
                    type: 'ATTACHMENT',
                    required: true,
                    name: 'image',
                    description: 'The image you want to upscale!'
                }
            ]
        },
        {
            name: 'bronya',
            description: 'Bronya\'s certificate.',
            options: [
                {
                    required: true,
                    name: 'text',
                    description:'Text to put on the certificate.',
                    type:'STRING'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            type: 'SUB_COMMAND',
            name: 'album-cover',
            description: 'Turn an image into an album cover',
            options: [
                {
                    type: 'ATTACHMENT',
                    required: true,
                    name: 'image',
                    description: 'Image to turn into album cover.'
                }
            ]
        },
        {
            name: 'gay',
            description: 'Apply a rainbow filter to an user or yourself.',
            options: [
                {
                    name: 'user',
                    description:'User to turn gay.',
                    type:'USER'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            name: 'jail',
            description: 'Put an user or yourself behind bars.',
            options: [
                {
                    name: 'user',
                    description:'User to put behind bars.',
                    type:'USER'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            name: 'petpet',
            description: 'Headpats.',
            options: [
                {
                    name: 'user',
                    description:'User to give headpats to.',
                    type:'USER'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            name: 'pixelate',
            description: 'Pixelate your avatar or an user\'s avatar.',
            options: [
                {
                    name: 'user',
                    description:'User to pixelate.',
                    type:'USER'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            name: 'rip',
            description: 'F in the chat.',
            options: [
                {
                    name: 'user',
                    description:'RIP <user>.',
                    type:'USER'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            name: 'sigma',
            description: 'Sigma Grindset.',
            options: [
                {
                    required: true,
                    name: 'text',
                    description:'Sigma Mindset.',
                    type:'STRING'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            name: 'slap',
            description: 'Will Smith moment.',
            options: [
                {
                    required: true,
                    name: 'user',
                    description:'User to slap.',
                    type:'USER'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            name: 'shit',
            description: 'Ew, I stepped in shit.',
            options: [
                {
                    required: true,
                    name: 'user',
                    description:'User.',
                    type:'USER'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            name: 'trash',
            description: 'Worthless.',
            options: [
                {
                    name: 'user',
                    description: 'User',
                    type: 'USER'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            name: 'trigger',
            description: 'Get triggered.',
            options: [
                {
                    name: 'user',
                    description: 'User.',
                    type: 'USER'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            name: 'wanted',
            description: 'Set a bounty on an user or yourself.',
            options: [
                {
                    name: 'user',
                    description:'User to put a bounty onto.',
                    type:'USER'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            name: 'wasted',
            description: 'Wasted.',
            options: [
                {
                    name: 'user',
                    description: 'User',
                    type: 'USER'
                }
            ],
            type: 'SUB_COMMAND'
        }
    ],
    run: async({interaction}) => {
        const target = interaction.options.getUser('user') || interaction.user
        const avatar = target.displayAvatarURL({size: 512, format: "png"})

        await interaction.deferReply()
        let image: Buffer

        switch (interaction.options.getSubcommand()) {
            case 'gay': {
                image = await CVC.Canvas.rainbow(avatar);
                break
            }

            case 'wanted': {
                image = await CVC.Canvas.wanted(avatar);
                break
            }

            case 'pixelate': {
                image = await CVC.Canvas.pixelate(avatar, 5);
                break
            }

            case 'rip': {
                image = await CVC.Canvas.rip(avatar);
                break
            }

            case 'jail':{
                image = await CVC.Canvas.jail(avatar, true);
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

            case 'album-cover': {
                // Creating the base
                const attachmentUrl = interaction.options.getAttachment('image').proxyURL
                let canvas = Canvas.createCanvas(1500, 1500)
                let context = canvas.getContext('2d')
                let background = await Canvas.loadImage(attachmentUrl)
                let sticker = await Canvas.loadImage('https://i.imgur.com/RIzNmyG.png')
                
                context.drawImage(background, 0, 0, canvas.width, canvas.height)

                let imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
                let pixels = imgData.data
                
                for (let i = 0; i < pixels.length; i = i + 4) {
                    let lightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3

                    pixels[i] = lightness 
                    pixels[i + 1] = lightness
                    pixels[i + 2] = lightness
                }
                context.putImageData(imgData, 0, 0)
                context.drawImage(sticker, 75, 1500 - 250, 280, 170.5)

                image = canvas.toBuffer()
                break
            }

            case 'petpet': {
                image = await petpet(avatar)
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

            case 'wasted': {
                image = await CVC.Canvas.wasted(avatar)
                break
            }

            case 'trash': {
                image = await CVC.Canvas.trash(avatar)
                break
            }

            case 'trigger': {
                image = await CVC.Canvas.trigger(avatar)
                break
            }

            case 'slap': {
                const iuserimg = interaction.user.displayAvatarURL({size: 512, format: "png"})
                image = await CVC.Canvas.slap(iuserimg, avatar)
                break
            }

            case 'shit': {
                image = await CVC.Canvas.shit(avatar)
                break
            }
            
            case 'upscale': {
                const accepted: MessageEmbed = new MessageEmbed()
                    .setTitle('Processing...')
                    .setColor('GREEN')
                    .setDescription('<a:lod:1021265223707000923> | Validating Link...\n<a:lod:1021265223707000923> | Upscaling Image...')
                await interaction.editReply({embeds: [accepted]})
    
                // Upscaling
                const link = interaction.options.getAttachment('image').proxyURL
                const contentType = interaction.options['_hoistedOptions'][0]['attachment'].contentType
                if (contentType == 'image/gif' || !(contentType.includes('image'))) {
                    const fail: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription('Must be an image!')
                    return interaction.editReply({embeds:[fail]})
                }

                accepted.setDescription('✅ | Valid Link!\n<a:lod:1021265223707000923> | Upscaling Image...')
                await interaction.editReply({embeds: [accepted]})

                
                const logGuild = await client.guilds.fetch('1002188088942022807')
                const logChannel: any = await logGuild.channels.fetch('1002189516574052433')

                const response = await deepAI.callStandardApi("torch-srgan", {image: link})
                const buffer = await axios.get(response.output_url, {responseType: 'arraybuffer'})
                const image = Buffer.from(buffer.data, "utf-8")
                const attachment = new MessageAttachment(image, 'image.png')
                const message = await logChannel.send({
                    files:[attachment]
                })


                const output: MessageEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('Preview')
                    .setImage(message.attachments.first().proxyURL)
                    .setTimestamp()
                
                const linkButton: MessageActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle('LINK')
                            .setLabel('Direct Image Link')
                            .setEmoji('🔗')
                            .setURL(message.attachments.first().proxyURL)
                    )
                
                accepted.setDescription('✅ | Valid Link!\n✅ | Upscaled Image!')
                await interaction.editReply({embeds: [accepted]})

                await interaction.editReply({
                    embeds: [output],
                    components: [linkButton]
                })
                break
            }
        }
        if (interaction.options.getSubcommand() !== "upscale") {
            let attachment = new MessageAttachment(image, 'image.gif')
            await interaction.editReply({files:[attachment]})
        }
    }
})