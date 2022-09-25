import { Command } from "../../structures/Command";
import { Permissions, MessageEmbed, User, Guild, GuildMember, Role, Collection} from "discord.js";

export default new Command({
    name: 'role',
    description: 'Role Management.',
    cooldown: 4500,
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'add',
            description: 'Add a role to an user.',
            options: [
                {
                    type: 'USER',
                    required: true,
                    name: 'user',
                    description: 'User.',
                },
                {
                    required: true,
                    name: 'role',
                    description: 'The role you want to give the user.',
                    type: 'ROLE'
                }
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'remove',
            description: 'Remove a role from an user.',
            options: [
                {
                    type: 'USER',
                    required: true,
                    name: 'user',
                    description: 'User.',
                },
                {
                    type: 'ROLE',
                    required: true,
                    name: 'role',
                    description: 'The role you want to remove from the user.',
                }
            ],
        }
    ],
    run: async({interaction}) => {
        const guild: Guild = interaction.guild
        const modMember: GuildMember = await guild.members.fetch(interaction.user)
        const modPerm: Readonly<Permissions> = modMember.permissions

        // Checking if interactor has permission
        if (!modPerm.has(Permissions.FLAGS.MANAGE_ROLES || Permissions.FLAGS.ADMINISTRATOR)) {
            const noPerm: MessageEmbed = new MessageEmbed()
                .setTitle('Missing Permission!')
                .setDescription('You need `Manage Roles` permission to use this command!')
                .setColor('RED')
            return interaction.reply({embeds:[noPerm]})
        }


        // Fetching info about the user
        const target: User = interaction.options.getUser('user')
        const targetGuildMember: GuildMember = await guild.members.fetch(target)

        const requestedRole = interaction.options.getRole('role')
        const requestedGuildRole = guild.roles.cache.find(role => role.id === requestedRole.id)
        const guildMemberRoles: Collection<string, Role> = targetGuildMember.roles.cache


        // Checking the priority of the role
        if (modMember.roles.highest.comparePositionTo(requestedGuildRole) <= 0) {
            const errorTopRole: MessageEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription('You are only allowed to add and remove roles below you!')
            return interaction.reply({embeds:[errorTopRole]})
        }


        // Adding/Removing The Roles
        switch (interaction.options.getSubcommand()) {
            case 'add': {
                if (guildMemberRoles.has(requestedRole.id)) {
                    const roleAddError: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`${target} already has the role ${requestedRole}!`)
                    return interaction.reply({embeds:[roleAddError], ephemeral: true});
                } 
                
                targetGuildMember.roles.add(requestedGuildRole)
                const roleAddSuccess: MessageEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('Role added to user!')
                    .setDescription(`${requestedRole} was added to ${target}!`)
                await interaction.reply({embeds:[roleAddSuccess]})
                
                break
            }

            case 'remove': {
                if (!guildMemberRoles.has(requestedRole.id)) {
                    const roleRemoveError: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`${target} does not have the role ${requestedRole}!`)
                    return interaction.reply({embeds:[roleRemoveError], ephemeral: true});
                }
                targetGuildMember.roles.remove(requestedGuildRole)
                const roleRemoveSuccess: MessageEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('Role removed from user!')
                    .setDescription(`${requestedRole} was removed from ${target}!`)
                await interaction.reply({embeds:[roleRemoveSuccess]})

                break
            }
        }
    }
})