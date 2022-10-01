import { Guild, MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";
import Blacklist from "../../schemas/Blacklist"
import { codeBlock } from "@discordjs/builders";
import util from 'util'
import { client } from "../..";
import os from 'os'

export default new Command({
    name: 'dev',
    description: 'Dev Tools',
    defaultPermission: false,
    ownerOnly: true,
    cooldown: 5000,
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'eval',
            description: 'N/A - Developer Only',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'code',
                    description: 'Code.'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'guild-count',
            description: 'Check the number of guilds Shinano is in.'
        },
        {
            type: 'SUB_COMMAND',
            name: 'guild-info',
            description: 'Get info about a guild.',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'guild-id',
                    description: 'Guild ID.'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'leave',
            description: 'Make the bot leave a guild.',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'guild-id',
                    description: 'Guild\'s ID'
                }
            ]
        },
        {
            type: 'SUB_COMMAND_GROUP',
            name: 'blacklist',
            description: 'hehe',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'add',
                    description: 'Add someone to the bot\'s blacklist.',
                    options: [
                        {
                            type: 'USER',
                            required: true,
                            name: 'user',
                            description: 'User\'s to blacklist.'
                        },
                        {
                            type: 'STRING',
                            required: true,
                            name: 'reason',
                            description: 'Reason for blacklist.'
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'remove',
                    description: 'Remove someone from the bot\'s blacklist.',
                    options: [
                        {
                            type: 'USER',
                            required: true,
                            name: 'user',
                            description: 'User\'s to unblacklist'
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'check',
                    description: 'Check if an user is blacklisted or not.',
                    options: [
                        {
                            type: 'USER',
                            required: true,
                            name: 'user',
                            description: 'User to the check in the blacklist.'
                        }
                    ]
                }
            ]
        }
    ],
    run: async({interaction}) => {
        
        // Dev Tools
        await interaction.deferReply()
        switch (interaction.options.getSubcommand()) {
            case 'eval': {
                const code: string = interaction.options.getString('code')

                let output: string = await new Promise((resolve, reject) => {resolve(eval(code))})
                if (typeof output !== "string") output = util.inspect(output, {depth:0});

                await interaction.editReply({
                    content: codeBlock('js', output)
                })
                break
            }


            case 'guild-count': {
                const guild: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`Shinano is currently in ${client.guilds.cache.size} guilds/servers`)
                await interaction.editReply({
                    embeds: [guild]
                })
                break
            }


            case 'leave': {
                try {
                    const guild = await client.guilds.fetch(interaction.options.getString('guild-id'))
                    await guild.leave()
                    
                    const left: MessageEmbed = new MessageEmbed()   
                        .setColor('GREEN')
                        .setDescription(`Shinano has left \`${guild.name}\``)
                    await interaction.editReply({embeds: [left]})
                } catch (err) {
                    const fail: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription('An error has occured!')
                    await interaction.editReply({embeds: [fail]})
                }
               break
            }


            case 'usage': {
                const memory = process.memoryUsage()
                const performance: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setTitle('Stats')
                    .addFields(
                        {name: 'Node', value: `
                        RSS: **${(memory.rss / 1024**2).toFixed(2)} MB**
                        External: **${(memory.external / 1024**2).toFixed(2)} MB**
                        Heap Total Mem: **${(memory.heapTotal / 1024**2).toFixed(2)} MB**
                        Heap Total Used: **${(memory.heapUsed / 1024**2).toFixed(2)} MB**`}
                    )
                await interaction.editReply({embeds: [performance]})
                break
            }


            case 'guild-info': {
                const guild: Guild = await client.guilds.fetch(interaction.options.getString('guild-id'))

                if (!guild) {
                    const noResult: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription('No guild of that ID can be found!')
                    return interaction.editReply({embeds: [noResult]})
                }


                const botMembers = guild.members.cache.filter(member => member.user.bot)
                function guildTier(guild: Guild) {
                    if (guild.premiumTier === 'NONE') return '**None**';
                    if (guild.premiumTier === 'TIER_1') return '**Tier 1**';
                    if (guild.premiumTier === 'TIER_2') return '**Tier 2**';
                    return '**Tier 3**';
                }

                const guildEmbed = new MessageEmbed()
                    .setTitle(`${guild.name}`)
                    .setFields(
                        {name:'Registered', value:`<t:${Math.floor(new Date(guild.createdAt).getTime() / 1000)}>`},
                        {name:'Current Owner', value:`<@${guild.ownerId}>`},
                        {name:'Boost Status', value:`${guildTier(guild)} [${guild.premiumSubscriptionCount}/14]`},
                        {name:'Role Count', value:`**${guild.name}** has **${guild.roles.cache.size} roles**.`},
                        {name:'Member Count', value:`**${guild.memberCount} Members** | **${guild.memberCount - botMembers.size} Users** and **${botMembers.size}** Bots`}
                    )
                    .setColor('#548ed1')
                    .setFooter({text:`Guild ID: ${guild.id}`})
                if (guild.iconURL()) guildEmbed.setThumbnail(guild.iconURL({dynamic: true, size: 512}))
                await interaction.editReply({embeds:[guildEmbed]})
                break
            }
        }
        
        const options = interaction.options
        if (options['_group'] != undefined) {
            switch (interaction.options.getSubcommandGroup()) {
                case 'blacklist': {
                    switch (interaction.options.getSubcommand()) {
                        case 'add': {
                            const blacklist = await Blacklist.findOne({userId: interaction.options.getUser('user').id})
                            if (blacklist == null) {
                                try {
                                    await Blacklist.create({
                                        blacklistedBy: interaction.user.id,
                                        userId: interaction.options.getUser('user').id,
                                        reason: interaction.options.getString('reason')
                                    })
            
                                    const success: MessageEmbed = new MessageEmbed()
                                        .setColor('GREEN')
                                        .setDescription(`${interaction.options.getUser('user')} has been added to blacklist!`)
                                        .addFields(
                                            {name: 'Reason:', value: interaction.options.getString('reason')},
                                            {name: 'User ID', value: interaction.options.getUser('user').id},
                                            {name: 'Blacklisted By:', value: `${interaction.user}`},
                                        )
                                        .setTimestamp()
                                    await interaction.editReply({embeds: [success]})
                                } catch (error) {
                                    const errorEmbed: MessageEmbed = new MessageEmbed()
                                        .setColor('RED')
                                        .setDescription("An error has occur! Please check console.")
                                    await interaction.editReply({embeds: [errorEmbed]})
                                    console.error(error)
                                }
                            } else {
                                const noOne: MessageEmbed = new MessageEmbed()
                                    .setColor('RED')
                                    .setDescription(`${interaction.options.getUser('user')} has already been blacklisted!`)
                                    .addFields(
                                        {name: 'Reason:', value: blacklist['reason']},
                                        {name: 'Blacklisted By:', value: `<@${blacklist['blacklistedBy']}>`}
                                    )
                                await interaction.editReply({embeds: [noOne]})
                            }
                            break
                        }
            

                        case 'remove': {
                            const blacklist = await Blacklist.findOne({userId: interaction.options.getUser('user').id})
                            if (blacklist != null) {
                                try {
                                    await Blacklist.deleteOne({userId: interaction.options.getUser('user').id})
            
                                    const success: MessageEmbed = new MessageEmbed()
                                        .setColor('GREEN')
                                        .setDescription(`${interaction.options.getUser('user')} has been removed from the blacklist!`)
                                        .setTimestamp()
                                    await interaction.editReply({embeds: [success]})
                                } catch (error) {
                                    const errorEmbed: MessageEmbed = new MessageEmbed()
                                        .setColor('RED')
                                        .setDescription("An error has occur! Please check console.")
                                    await interaction.editReply({embeds: [errorEmbed]})
                                    console.error(error)
                                }
                            } else {
                                const noOne: MessageEmbed = new MessageEmbed()
                                    .setColor('RED')
                                    .setDescription('User is not blacklisted!')
                                await interaction.editReply({embeds: [noOne]})
                            }
                            break
                        }

                        
                        case 'check': {
                            const blacklist = await Blacklist.findOne({userId: interaction.options.getUser('user').id})
                            if (blacklist != null) {
                                const blacklisted: MessageEmbed = new MessageEmbed()
                                    .setColor('GREEN')
                                    .setTitle('Uh oh, user is blacklisted!')
                                    .addFields(
                                        {name: 'User:', value: `${interaction.options.getUser('user')}`},
                                        {name: 'Reason:', value: `${blacklist['reason']}`},
                                        {name: 'Blacklisted By:', value: `<@${blacklist['blacklistedBy']}>`}
                                    )
                                await interaction.editReply({embeds:[blacklisted]})
                            } else {
                                const noOne: MessageEmbed = new MessageEmbed()
                                    .setColor('RED')
                                    .setDescription('User is not blacklisted!')
                                await interaction.editReply({embeds: [noOne]})
                            }
                            break
                        }
                    }
                }
            }
        }
    }
})
