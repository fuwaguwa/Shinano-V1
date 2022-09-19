import { Guild, GuildMember, MessageEmbed, Permissions, User } from "discord.js";
import { Command } from "../../structures/Command";
import { randStr } from "../../structures/Utils";

export default new Command({
    name: 'fix-name',
    description: 'Fix an user\'s ridiculous name.',
    cooldown: 4500,
    options: [
        {
            required: true,
            type: 'USER',
            name: 'user',
            description: 'The user with the cringe name.'
        }
    ],
    run: async({interaction}) => {
        const guild: Guild = interaction.guild
        const iUSer: GuildMember = await guild.members.fetch(interaction.user)

        if (!iUSer.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES || Permissions.FLAGS.ADMINISTRATOR)) {
            const noPerm: MessageEmbed = new MessageEmbed()
                .setTitle('Missing Permission!')
                .setDescription('You need `Manage Nicknames` permission to use this command!')
                .setColor('RED')
            return interaction.reply({embeds:[noPerm], ephemeral: true})
        }

        
        const user: User = interaction.options.getUser('user')
        const cringe: GuildMember = await guild.members.fetch(user)
        cringe.setNickname(`Fixed Name #${randStr()}`)
        
        const fixed: MessageEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Fixed ${user}'s name!`)
        await interaction.reply({embeds:[fixed], ephemeral: true})
    }
})