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
    cooldown: 4000,
    options: [
        {   
            type: 'SUB_COMMAND_GROUP',
            name: 'anime',
            description: 'uwu',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'bomb',
                    description: 'Bombs you with pics/gifs/videos!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'a-level',
                    description: 'There\'s more than one hole'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'random',
                    description: 'Return a random image/gif/video from a random category.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'ass',
                    description: 'Big Booty.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'fanbox',
                    description: 'Images from artists\' Fanbox/Patreon (High Quality)'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'head',
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
                            description: 'The category you want GIFs from. Don\'t choose this option if you want random category.',
                            choices: [
                                {name: 'Shipgirls', value: 'shipgirls'},
                                {name: 'Undies', value: 'undies'},
                                {name: 'Elf', value: 'elf'},
                                {name: 'Genshin', value: 'genshin'},
                                {name: 'Kemonomimi', value: 'kemonomimi'},
                                {name: 'Misc', value: 'misc'},
                                {name: 'Uniform', value: 'uniform'},
                                {name: 'VTubers', value: 'vtubers'},
                                {name: 'Random (Categories Listed Here)', value: 'random'},
                            ]
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'minge',
                    description: 'Down there.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'succubus',
                    description: 'Demons girls that will suck you dry.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'thighs',
                    description: 'The undeniably best part of the leg.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'yuri',
                    description: 'Girls on girls'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'genshin',
                    description: 'Genshin Girls'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'undies',
                    description: 'Undies & Sport Clothes.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'kemonomimi',
                    description: 'Girls possessing animal features (foxgirls, catgirls, etc) and succubus.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'uniform',
                    description: 'Maid, Office Lady, JK, you name it!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'vtubers',
                    description: 'Lewd VTubers Pics!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'shipgirls',
                    description: 'Azur Lane Shipgirls!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'elf',
                    description: 'For people who are affectionate with pointy-eared girls.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'video',
                    description: 'GIFs! WITH SOUND!',
                    options: [
                        {
                            type: 'STRING',
                            name: 'video-category',
                            description: 'The category you want videos from. Don\'t choose this option if you want random category.',
                            choices: [
                                {name: 'Shipgirls', value: 'shipgirls'},
                                {name: 'Undies', value: 'undies'},
                                {name: 'Elf', value: 'elf'},
                                {name: 'Genshin', value: 'genshin'},
                                {name: 'Kemonomimi', value: 'kemonomimi'},
                                {name: 'Misc', value: 'misc'},
                                {name: 'Uniform', value: 'uniform'},
                                {name: 'VTubers', value: 'vtubers'},
                                {name: 'Random (Categories Listed Here)', value: 'random'},
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
                    description: 'Girls with big jugs!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'misc',
                    description: 'Categories that are not mentioned here!'
                }
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
                    name: 'a-level',
                    description: 'There\'s more than one hole'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'head',
                    description: 'Girls eating up meat sticks.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'breasts', 
                    description: 'Big and heavy.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'minge',
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
            .setTimestamp()
        if (interaction.options['_group']) {
            if (interaction.options.getSubcommandGroup() === 'anime') {
                switch (interaction.options.getSubcommand()) {
                    case 'random': {
                        await nsfwRandom(interaction, lewdEmbed)
                        break
                    }
    

                    case 'bomb': {
                        await nsfwBomb(interaction, lewdEmbed)
                        break
                    }

                    case 'fanbox': {
                        await nsfwPrivateFanbox(interaction, lewdEmbed)
                        break
                    }


                    case 'elf': case 'genshin': case 'kemonomimi': case 'misc': case 'shipgirls': case 'undies': case 'uniform':
                    case 'vtubers': case 'yuri': {
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

                        if (tag === 'minge') tag = 'pussy'
                        if (tag === 'head') tag = 'blowjob'
                        if (tag === 'breasts') tag = 'boobs'
                        if (tag === 'a-level') tag = 'anal'

                        const response = await fetch(`https://AmagiAPI.fuwafuwa08.repl.co/nsfw/public/${tag}`, {
                            method: "GET",
                        })
                        const waifu = await response.json()
                        lewdEmbed.setImage(waifu.link)


                        await interaction.editReply({embeds:[lewdEmbed]})
                        break
                    }
      
                }
                
            } else if (interaction.options.getSubcommandGroup() === 'irl') {
                let tag = interaction.options.getSubcommand()

                if (tag === 'minge') tag = 'pussy'
                if (tag === 'head') tag = 'blowjob'
                if (tag === 'breasts') tag = 'boobs'
                if (tag === 'a-level') tag = 'anal'


                const response = await fetch(`https://AmagiAPI.fuwafuwa08.repl.co/nsfw/porn/${tag}`, {
                    method: "GET",
                })
                const result = await response.json()

                if ((result.link as string).includes('redgifs') || (result.link as string).includes('.gifv')) return interaction.editReply({content: result.link})
                lewdEmbed.setImage(result.link)
                
                await interaction.editReply({embeds: [lewdEmbed]})
            }
        } 
    }
})
