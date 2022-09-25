import { Command } from "../../structures/Command";
import { Guild, GuildMember, MessageEmbed, User } from "discord.js";

export default new Command({
    name: 'avatar',
    description: 'Get user\'s and guild\'s avatar',
    cooldown: 4500,
    options: [
        {
            type:'SUB_COMMAND',
            name: 'user',
            description: 'Get an user\'s avatar or your avatar.',
            options: [
                {
                    type:'USER',
                    name: 'user',
                    description:'User.',
                }
            ],
        },
        {
            type:'SUB_COMMAND',
            name: 'guild',
            description:'Get the user guild\'s avatar.',
            options: [
                {
                    type:'USER',
                    name: 'user',
                    description:'User.',
                }
            ],
        }
    ],
    run: async({interaction}) => {
        let avatarEmbed: MessageEmbed = new MessageEmbed()
            .setColor('BLUE')
        switch (interaction.options.getSubcommand()) {
            case 'user': {
                const user: User = interaction.options.getUser('user') || interaction.user
                
                avatarEmbed
                    .setDescription(`${user}'s avatar`)
                    .setImage(user.displayAvatarURL({dynamic:true, size: 1024}))
                    .setFooter({text:`UID: ${user.id}` })
                break 
            }

            case 'guild': {
                const user: User = interaction.options.getUser('user') || interaction.user

                const guild: Guild = interaction.guild
                const guildMember: GuildMember  = await guild.members.fetch(user)

                if (guildMember.avatarURL({dynamic: true, size: 1024}) == null) {
                    const errorEmbed: MessageEmbed = new MessageEmbed()
                        .setDescription('User does not have a guild avatar! Please use `/avatar user` instead!')
                        .setColor('RED')
                    return interaction.reply({embeds:[errorEmbed]})
                }

                avatarEmbed
                    .setColor('BLUE')
                    .setDescription(`${user}'s Guild Avatar.`)
                    .setImage(guildMember.avatarURL({dynamic: true, size: 1024} ))
                    .setFooter({text:`UID: ${user.id}` })
                break
            }
        }
        await interaction.reply({embeds:[avatarEmbed]})
    }
})