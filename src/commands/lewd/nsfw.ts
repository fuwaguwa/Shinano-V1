import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";
import fetch from "node-fetch"
import {config} from 'dotenv'
import { nsfwRandom } from "./subcommands/nsfw/random";
import { nsfwBomb } from "./subcommands/nsfw/bomb";
import { nsfwPrivateCollection } from "./subcommands/nsfw/privateColle";
import { nsfwVideo } from "./subcommands/nsfw/video";
import { nsfwPrivateFanbox } from "./subcommands/nsfw/fanbox";
import { nsfwGif } from "./subcommands/nsfw/gif";
config();

export default new Command({
    name: 'nsfw',
    description: 'NSFW Commands - Anime and IRL',
    defaultPermission: false,
    nsfw: true,
    voteRequired: true,
    cooldown: 4000,
    options: [
        {   
            type: 'SUB_COMMAND_GROUP',
            name: 'anime',
            description: 'uwu',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'fanbox',
                    description: 'Images from artists\' FANBOX/Patreon (High Quality)',
                    options: [
                        {
                            type: 'STRING',
                            name: 'fanbox-category',
                            description: 'The category you want FANBOX/Patreon content from. Ignore this option for random category.',
                            choices: [
                                {name: 'Shipgirls', value: 'shipgirls'},
                                {name: 'Undies', value: 'undies'},
                                {name: 'Elf', value: 'elf'},
                                {name: 'Genshin', value: 'genshin'},
                                {name: 'Kemonomimi', value: 'kemonomimi'},
                                {name: 'Misc', value: 'misc'},
                                {name: 'Uniform', value: 'uniform'},
                            ]
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'bomb',
                    description: 'Bombs you with lewdness!',
                    options: [
                        {
                            type: "STRING",
                            name: 'category',
                            description: 'The category you want to be bombed with. Ignore this option for random category.',
                            choices: [
                                {name: 'Fanbox', value: 'fanbox'},
                                {name: 'Shipgirls', value: 'shipgirls'},
                                {name: 'Undies', value: 'undies'},
                                {name: 'Elf', value: 'elf'},
                                {name: 'Genshin', value: 'genshin'},
                                {name: 'Kemonomimi', value: 'kemonomimi'},
                                {name: 'Misc', value: 'misc'},
                                {name: 'Uniform', value: 'uniform'},
                            ]
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'anal',
                    description: 'There\'s more than one hole'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'ass',
                    description: 'Big  booty.',
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'thighs',
                    description: 'The best part of the leg.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'paizuri',
                    description: 'Squished between thiccness.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'solo',
                    description: 'Single Player Mode.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'nut',
                    description: 'Baby gravy.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'random',
                    description: 'Return images/GIFs/videos from a random category.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'blowjob',
                    description: 'Girls "playing the trumpet"'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'gif',
                    description: 'In case pictures are not enough to your satisfaction.',
                    options: [
                        {
                            type: 'STRING',
                            name: 'gif-category',
                            description: 'The category you want GIFs from. Ignore this option for random category.',
                            choices: [
                                {name: 'High-Quality Random', value: 'random'},
                                {name: 'Shipgirls', value: 'shipgirls'},
                                {name: 'Undies', value: 'undies'},
                                {name: 'Elf', value: 'elf'},
                                {name: 'Genshin', value: 'genshin'},
                                {name: 'Kemonomimi', value: 'kemonomimi'},
                                {name: 'Misc', value: 'misc'},
                                {name: 'Uniform', value: 'uniform'},
                            ]
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'genshin',
                    description: 'Genshin Girls'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'undies',
                    description: 'Undies, sportwears, swimsuits and bodysuits.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'kemonomimi',
                    description: 'Fox girls, cat girls, bunny girls, succubus and more!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'uniform',
                    description: 'Maid, Office Lady, JK, you name it!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'shipgirls',
                    description: 'Shipgirls from Azur Lane!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'elf',
                    description: 'Thicc and pointy-eared.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'video',
                    description: 'GIFs! WITH SOUND!',
                    options: [
                        {
                            type: 'STRING',
                            name: 'video-category',
                            description: 'The category you want videos from. Ignore this option for random category.',
                            choices: [
                                {name: 'Shipgirls', value: 'shipgirls'},
                                {name: 'Undies', value: 'undies'},
                                {name: 'Elf', value: 'elf'},
                                {name: 'Genshin', value: 'genshin'},
                                {name: 'Kemonomimi', value: 'kemonomimi'},
                                {name: 'Misc', value: 'misc'},
                                {name: 'Uniform', value: 'uniform'},
                            ]
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'nekomimi',
                    description: 'Catgirls!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'feet',
                    description: 'Shinano will not question your kink.'
                }, 
                {
                    type: 'SUB_COMMAND',
                    name: 'breasts',
                    description: 'Girls with huge jugs!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'misc',
                    description: 'Categories that are not mentioned here!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'cunny',
                    description: '😺🐈'
                },
            ]
        },
        {
            type: 'SUB_COMMAND_GROUP',
            name: 'irl',
            description: 'Real People.',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'ass',
                    description: 'Big Booty IRL.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'nut',
                    description: 'Meat stick\'s special sauce.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'anal',
                    description: 'There\'s more than one hole'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'blowjob',
                    description: 'Girls eating up meat sticks.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'breasts', 
                    description: 'Big and heavy.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'cunny',
                    description: 'Down there.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'random',
                    description: 'Return image/video from a random category.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'cosplay',
                    description: 'Life imitates art.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'video',
                    description: 'Videos from RedGIFS.'
                }
            ]
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()
        let lewdEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setFooter({text:`Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
        if (interaction.options['_group']) {
            if (interaction.options.getSubcommandGroup() === 'anime') {
                switch (interaction.options.getSubcommand()) {
                    case 'random': {
                        await nsfwRandom(interaction, lewdEmbed)
                        break
                    }
    

                    case 'bomb': {
                        await nsfwBomb(interaction)
                        break
                    }

                    case 'fanbox': {
                        await nsfwPrivateFanbox(interaction, lewdEmbed)
                        break
                    }


                    case 'elf': case 'genshin': case 'kemonomimi': case 'misc': case 'shipgirls': case 'undies': case 'uniform':
                    case 'yuri': {
                        await nsfwPrivateCollection(interaction, lewdEmbed, interaction.options.getSubcommand())
                        break
                    }


                    case 'video': {
                        await nsfwVideo(interaction)
                        break
                    }

                    case 'gif': {
                        await nsfwGif(interaction, lewdEmbed)
                        break
                    }


                    default: {
                        let tag = interaction.options.getSubcommand()

                        if (tag === 'cunny') tag = 'pussy'
                        if (tag === 'breasts') tag = 'boobs'
                        if (tag === 'nut') tag = 'cum'

                        const response = await fetch(`https://AmagiAPI.fuwafuwa08.repl.co/nsfw/public/${tag}`, {
                            method: "GET",
                            headers: {
                                "Authorization": process.env.amagiApiKey
                            }
                        })
                        const waifu = await response.json()
                        lewdEmbed.setImage(waifu.link)


                        await interaction.editReply({embeds:[lewdEmbed]})
                        break
                    }
      
                }
                
            } else if (interaction.options.getSubcommandGroup() === 'irl') {
                let tag = interaction.options.getSubcommand()

                if (tag === 'cunny') tag = 'pussy'
                if (tag === 'breasts') tag = 'boobs'
                if (tag === 'nut') tag = 'cum'



                const response = await fetch(`https://AmagiAPI.fuwafuwa08.repl.co/nsfw/porn/${tag}`, {
                    method: "GET",
                    headers: {
                        "Authorization": process.env.amagiApiKey
                    }
                })
                const result = await response.json()

                if ((result.link as string).includes('redgifs') || (result.link as string).includes('.gifv')) return interaction.editReply({content: result.link})
                lewdEmbed.setImage(result.link)
                
                await interaction.editReply({embeds: [lewdEmbed]})
            }
        } 
    }
})
