import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";
import fetch from "node-fetch"
import {config} from 'dotenv'
config();

export default new Command({
    name: 'nsfw',
    description: 'NSFW Commands',
    defaultPermission: false,
    nsfw: true,
    cooldown: 3500,
    options: [
        {   
            type: 'SUB_COMMAND_GROUP',
            name: 'hentai',
            description: 'Hentai',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'bomb',
                    description: 'Bombs you with hentai!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'random',
                    description: 'Send you hentai from a random category.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'anal',
                    description: 'There\'s more than one hole...'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'ass',
                    description: 'Big Booty.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'blowjob',
                    description: 'Girls "playing the trumpet"'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'cum',
                    description: 'Baby Gravy.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'gif',
                    description: 'In case pictures are not enough to your satisfaction.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'paizuri',
                    description: 'Squished between titties!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'pussy',
                    description: '🐱'
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
                    description: 'Kemonomimi & Succubus.'
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
                    description: 'GIFs! WITH SOUND!'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'nekomimi',
                    description: '\'Cause everyone need a catgirl in their life.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'masturbation',
                    description: 'Mode: Solo'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'feet',
                    description: 'Shinano will not question your kink.'
                }, 
                {
                    type: 'SUB_COMMAND',
                    name: 'boobs',
                    description: 'Girls with big jugs!'
                }
            ]
        },
        {
            type: 'SUB_COMMAND_GROUP',
            name: 'porn',
            description: 'Real People.',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'ass',
                    description: 'Big Booty IRL.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'blowjob',
                    description: 'Girls eating up meat sticks.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'boobs', 
                    description: 'Booba.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'pussy',
                    description: '🐱'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'anal',
                    description: 'A tighter hole.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'random',
                    description: 'Porn from random category.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'cosplay',
                    description: 'Life imitates art.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'cum',
                    description: 'Sticky white stuff.'
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'video',
                    description: 'Porn Videos on RedGIFS.'
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
            if (interaction.options.getSubcommandGroup() === 'hentai') {
                switch (interaction.options.getSubcommand()) {
                    case 'random': {
                        const response = await fetch('https://amagi-api-b.herokuapp.com/nsfw/random', {
                            method: "GET",
                        })
                        const waifu = await response.json()
                        if (!(waifu.link as string).endsWith('mp4')) {
                            lewdEmbed.setImage(waifu.link)
                            return interaction.editReply({embeds:[lewdEmbed]})
                        }
                        return interaction.editReply({content: waifu.link})
                    }
    

                    case 'bomb': {
                        const response = await fetch('https://amagi-api-b.herokuapp.com/nsfw/bomb', {
                            method: "GET",
                        })
                        const waifu = await response.json()
                        return interaction.editReply({
                            content: waifu.links.join("\n")
                        })
                    }


                    case 'elf': case 'genshin': case 'kemonomimi': case 'misc': case 'shipgirls': case 'undies':
                    case 'vtubers': case 'yuri': {
                        const category = interaction.options.getSubcommand()
                        const response = await fetch(`https://amagi-api-b.herokuapp.com/nsfw/private/${category}`, {
                            method: "GET",
                        })
                        const uwu = await response.json()

                        if (!((uwu.body.link as string).endsWith('mp4'))) {
                            lewdEmbed.setImage(uwu.body.link)
                            return interaction.editReply({embeds: [lewdEmbed]})
                        }
                        await interaction.editReply({content: uwu.body.link}) 
                    }


                    case 'video': {
                        async function videoFetch() {
                            const response = await fetch(`https://amagi-api-b.herokuapp.com/nsfw/private/random?type=mp4`, {
                                method: "GET",
                            })
                            
                            const responseJson = await response.json()
                            if (!responseJson.body) return videoFetch()
                            return responseJson.body.link
                        }
                        
                    
                        await interaction.editReply({content: await videoFetch()}) 
                        break
                    }

                    
                    default: {
                        const response = await fetch(`https://amagi-api-b.herokuapp.com/nsfw/public/${interaction.options.getSubcommand()}`, {
                            method: "GET",
                        })
                        const waifu = await response.json()
                        lewdEmbed.setImage(waifu.link)
                        await interaction.editReply({embeds:[lewdEmbed]})
                        break
                    }
      
                }
                
            } else if (interaction.options.getSubcommandGroup() === 'porn') {
                switch (interaction.options.getSubcommand()) {
                    default: {
                        const response = await fetch(`https://amagi-api-b.herokuapp.com/nsfw/porn/${interaction.options.getSubcommand()}`, {
                            method: "GET",
                        })
                        const result = await response.json()

                        if ((result.link as string).includes('redgifs') || (result.link as string).includes('.gifv')) return interaction.editReply({content: result.link})

                        lewdEmbed.setImage(result.link)
                        await interaction.editReply({embeds: [lewdEmbed]})
                    }
                }
            }
        } 
    }
})
