import { Command } from "../../structures/Command";
import { Permissions, MessageEmbed, Guild, GuildMember } from "discord.js";

export default new Command({
    name: 'purge',
    description: 'Bulk delete a certain number of messages',
    cooldown: 4500,
    options: [
        {
            required: true,
            name: 'messages',
            description: 'The number of messages you want to delete (Maximum Amount: 100)',
            type: 'INTEGER'
        }
    ],
    run: async({interaction}) => {
        const guild: Guild = interaction.guild
        const guildMember: GuildMember = await guild.members.fetch(interaction.user)
        const memberPerms: Readonly<Permissions> = guildMember.permissions

        if (!memberPerms.has(Permissions.FLAGS.MANAGE_MESSAGES || Permissions.FLAGS.ADMINISTRATOR)) {
            const noPerm: MessageEmbed = new MessageEmbed()
                .setTitle('Missing Permission!')
                .setColor('RED')
                .setDescription('You need `Manage Messages` permission to use this command!')
            return interaction.reply({embeds:[noPerm], ephemeral: true})
        }

        const numMsg = interaction.options.getInteger('messages')
        if (numMsg > 100) {
            const tooMuch: MessageEmbed = new MessageEmbed()
                .setDescription('The maximum number of messages that you can delete is 100!')
                .setColor('RED')
            return interaction.reply({embeds:[tooMuch], ephemeral:true})
        }

        const messages = await interaction.channel.messages.fetch({limit: numMsg})
        await interaction.channel.bulkDelete(messages, true)
        const purgedEmbed: MessageEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Purged ${numMsg} messages!`)
            .setFooter({text: 'The bot does not delete messages older than 14 days. This is an API limitation.'})
        await interaction.reply({embeds: [purgedEmbed], ephemeral: true})
    }
})