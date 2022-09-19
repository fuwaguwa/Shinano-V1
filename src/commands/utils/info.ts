import { Command } from "../../structures/Command";
import { Guild, GuildMember,  MessageEmbed, PermissionString,  User } from "discord.js";
import { toTitleCase } from "../../structures/Utils";

export default new Command({
    name: 'info',
    description: 'Get info about an user or the guild you are currently in.',
    cooldown: 4500,
    options: [
        {
            name: 'user',
            description: 'Information about an user or yourself.',
            options: [
                {
                    name: 'user',
                    description: 'User.',
                    type: 'USER'
                }
            ],
            type:'SUB_COMMAND'
        },
        {
            name: 'guild',
            description: 'Information about the guild you are currently in.',
            type: 'SUB_COMMAND'
        }
    ],
    run: async({interaction}) => {
        switch (interaction.options.getSubcommand()) {
            case 'user': {
                await interaction.deferReply()
                let user: User = interaction.options.getUser('user') || interaction.user

                
                // Filtering
                const guild: Guild = interaction.guild
                const guildMember: GuildMember = await guild.members.fetch(user)

                if (!guildMember) {
                    const notAMember: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription('Member does not exist or not apart of this guild')
                    return interaction.editReply({embeds: [notAMember]})
                }


                // Sorting
                let userRoles = guildMember.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .map(r => r)
                    .filter(role => {if (role.name !== '@everyone') return role;})

    
                // Sorting Perms
                function acknowledgment(user: User) {
                    if (user.id === guild.ownerId) return 'Owner';
                    if (keyPermsFormatted.includes('Administrator')) return 'Admin';
                    if (keyPermsFormatted.includes('Kick Members' || 'Ban Members')) return 'Moderator';
                    return 'Member';
                }

                const userPerms: PermissionString[] = guildMember.permissions.toArray()
                const keyPerms: string[] = [
                    'ADMINISTRATOR',
                    'MANAGE_GUILD',
                    'MANAGE_ROLES',
                    'MANAGE_CHANNELS',
                    'MANAGE_MESSAGES',
                    'MANAGE_WEBHOOKS',
                    'MANAGE_NICKNAMES',
                    'MANAGE_EMOJIS_AND_STICKER',
                    'KICK_MEMBERS',
                    'BAN_MEMBERS',
                    'MENTION_EVERYONE'
                ]

                let keyPermsFormatted: string[] = []
                userPerms.forEach((permission) => {
                    if (keyPerms.includes(permission)) {
                        let splitPerms = permission.toLowerCase().split('_')

                        splitPerms.forEach((perms, index) => {
                            splitPerms[index] = toTitleCase(perms)
                        })

                        const perm = splitPerms.join(' ')
                        keyPermsFormatted.push(perm)
                    }
                })

                
                // Displaying Information
                const embedColor = (color => {
                    if (!color) return 'BLUE'
                    if (color === '#000000') return 'BLUE'
                    return color
                })


                const infoEmbed: MessageEmbed = new MessageEmbed()
                    .setColor(embedColor(userRoles[0].hexColor))
                    .setAuthor({name: `${user.tag}`, iconURL: `${user.displayAvatarURL({dynamic: true, size: 512})}`})
                    .setThumbnail(user.displayAvatarURL({dynamic: true, size: 512}))
                    .setFooter({text: `UID: ${user.id}`})
                    .setFields(
                        {name: 'User', value: `${user}`},
                        {name: 'Joined', value: `<t:${Math.floor(new Date(guildMember.joinedAt).getTime() / 1000)}>`},
                        {name: 'Registered', value: `<t:${Math.floor(new Date(user.createdAt).getTime() / 1000)}>`},
                        {name: `Roles - ${guildMember.roles.cache.size - 1}`, value: `${guildMember.roles.cache.size - 1 !== 0 ? userRoles.join(" ") : "None"}`},
                        {name: 'Server Acknowledgment', value: `${acknowledgment(user)}`}
                    )

                if (keyPerms.length !== 0) infoEmbed.addField('Main Permissions', `${keyPermsFormatted.sort().join(', ')}`);
                
                await interaction.editReply({embeds:[infoEmbed]})
                break
            }

            case 'guild': {
                const guild: Guild = interaction.guild
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
                        {name:'Member Count', value:`**${guild.memberCount} Members** | **${guild.memberCount - botMembers.size} Users** and **${botMembers.size} Bots**`}
                    )
                    .setColor('#548ed1')
                    .setFooter({text:`Guild ID: ${guild.id}`})
                if (guild.iconURL()) guildEmbed.setThumbnail(guild.iconURL({dynamic: true, size: 512}))
                await interaction.reply({embeds:[guildEmbed]})
                break
            }
        }
    }
})