import { Command } from "../../structures/Command";
import { Permissions, MessageEmbed, User, Guild, GuildMember, Role, Collection} from "discord.js";

export default new Command({
    name: 'role',
    description: 'Role Management.',
    cooldown: 4500,
    options: [
        {
            name: 'add',
            description: 'Add a role to an user.',
            options: [
                {
                    required: true,
                    name: 'user',
                    description: 'User.',
                    type: 'USER'
                },
                {
                    required: true,
                    name: 'role',
                    description: 'The role you want to give the user.',
                    type: 'ROLE'
                }
            ],
            type: 'SUB_COMMAND'
        },
        {
            name: 'remove',
            description: 'Remove a role from an user.',
            options: [
                {
                    required: true,
                    name: 'user',
                    description: 'User.',
                    type: 'USER'
                },
                {
                    required: true,
                    name: 'role',
                    description: 'The role you want to remove from the user.',
                    type: 'ROLE'
                }
            ],
            type: 'SUB_COMMAND'
        }
    ],
    run: async({interaction}) => {
        const guild: Guild = interaction.guild
        const modMember: GuildMember = await guild.members.fetch(interaction.user)
        const modPerm: Readonly<Permissions> = modMember.permissions
        if (!modPerm.has(Permissions.FLAGS.MANAGE_ROLES || Permissions.FLAGS.ADMINISTRATOR)) {
            const noPerm: MessageEmbed = new MessageEmbed()
                .setTitle('Missing Permission!')
                .setDescription('You need `Manage Roles` permission to use this command!')
                .setColor('RED')
            return interaction.reply({embeds:[noPerm]})
        }

        const target: User = interaction.options.getUser('user')
        const targetGuildMember: GuildMember = await guild.members.fetch(target)

        const reqRole = interaction.options.getRole('role')
        const reqGuildRole = guild.roles.cache.find(role => role.id === reqRole.id)
        const guildMemberRole: Collection<string, Role> = targetGuildMember.roles.cache

        if (modMember.roles.highest.comparePositionTo(reqGuildRole) <= 0) {
            const errorTopRole: MessageEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription('You are only allowed to add and remove roles below you!')
            return interaction.reply({embeds:[errorTopRole]})
        }

        const roleAddError: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`${target} already has the role ${reqRole}!`)
        const roleRemoveError: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`${target} does not have the role ${reqRole}!`)
        const roleAddSuccess: MessageEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Role added to user!')
            .setDescription(`${reqRole} was added to ${target}!`)
        const roleRemoveSuccess: MessageEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Role removed from user!')
            .setDescription(`${reqRole} was removed from ${target}!`)
        
        switch (interaction.options.getSubcommand()) {
            case 'add':
                if (guildMemberRole.has(reqRole.id)) return interaction.reply({embeds:[roleAddError], ephemeral: true});
                targetGuildMember.roles.add(reqGuildRole)
                return interaction.reply({embeds:[roleAddSuccess]})
            case 'remove':
                if (!guildMemberRole.has(reqRole.id)) return interaction.reply({embeds:[roleRemoveError], ephemeral: true});
                targetGuildMember.roles.remove(reqGuildRole)
                return interaction.reply({embeds:[roleRemoveSuccess]})
        }
    }
})