import { User, Guild, GuildMember, MessageEmbed, PermissionString } from "discord.js";
import { toTitleCase } from "../../../structures/Utils";
import { ShinanoInteraction } from "../../../typings/Command";

export async function infoUser(interaction: ShinanoInteraction) {
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
        if (keyPermsFormatted.includes('Kick Members') || keyPermsFormatted.includes('Ban Members')) return 'Moderator';
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
}