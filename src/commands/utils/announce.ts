import { Command } from "../../structures/Command";
import { Guild, GuildMember, MessageEmbed, Permissions, TextChannel } from "discord.js";

export default new Command({
    name: 'announce',
    description: 'Announce something using the bot and embed',
    cooldown: 3000,
    options: [
        {
            type: 'STRING',
            required: true,
            name: 'text',
            description: 'The text you want to announce.'
        },
        {
            type:'CHANNEL',
            required: true,
            name: 'channel',
            description: 'The channel you want the announcement to be sent at.',
            channelTypes: [
                'GUILD_TEXT',
                'GUILD_NEWS',
            ]
        },
        {
            type: 'BOOLEAN',
            required: true,
            name: 'everyone-ping',
            description: 'Ping @everyone when the announcement is sent.',
        },
        {
            type: 'BOOLEAN',
            required: true,
            name: 'show-author',
            description: 'Show who sent the announcement in the message.'
        },
        {
            type: 'STRING',
            name: 'title',
            description: 'Title for the announcement.',
        }
    ],
    run: async({interaction}) => {
        const channel = interaction.options.getChannel('channel')
        const text: string = interaction.options.getString('text')
        const title = interaction.options.getString('title')
        const everyone: Boolean = interaction.options.getBoolean('everyone-ping')
        const author: Boolean = interaction.options.getBoolean('show-author')
        const guild: Guild = interaction.guild
        const guildMember: GuildMember = await guild.members.fetch(interaction.user)
        const guildChannel: TextChannel = (await guild.channels.fetch(channel.id)) as TextChannel

        
        if (!guildMember.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES || Permissions.FLAGS.ADMINISTRATOR)) {
            const noPerm: MessageEmbed = new MessageEmbed()
                .setTitle('Missing Permission!')
                .setColor('RED')
                .setDescription('You need `Manage Messages` permission to use this command!')
            return interaction.reply({embeds: [noPerm], ephemeral: true})
        }
        if (!guildMember.permissions.has(Permissions.FLAGS.MENTION_EVERYONE) && everyone === true) {
            const noPerm: MessageEmbed = new MessageEmbed()
                .setTitle('Missing Permission!')
                .setColor('RED')
                .setDescription('You need `Mention Everyone` permission to use this command!')
            return interaction.reply({embeds: [noPerm], ephemeral: true})
        }
        const hasPermissionInChannel = guildChannel.permissionsFor(interaction.user).has('SEND_MESSAGES', false)
        if (!hasPermissionInChannel) {
            const noPerm: MessageEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Missing Permission!')
                .setDescription('You do not have the permission to send messages in this channel!')
            return interaction.reply({embeds: [noPerm], ephemeral: true})
        }
        if (text.length > 4096) {
            const tooLong: MessageEmbed = new MessageEmbed()
                .setDescription('You can only have 4096 characters in the embed\'s description field!')
                .setColor('RED')
            return interaction.reply({embeds: [tooLong], ephemeral: true})
        }
        if (title && title.length > 256) {
            const tooLong: MessageEmbed = new MessageEmbed()
                .setDescription('You can only have 256 characters in the embed\'s title field!')
                .setColor('RED')
            return interaction.reply({embeds: [tooLong], ephemeral: true})
        }


        let announcement: MessageEmbed = new MessageEmbed()
            .setDescription(text)
            .setColor('BLUE')
        if (author) announcement.setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({dynamic: true})});
        if (title) announcement.setTitle(title);
        everyone == false
            ? await guildChannel.send({embeds:[announcement]})
            : await guildChannel.send({content: `@everyone`, embeds:[announcement]})
        const response: MessageEmbed = new MessageEmbed()
            .setDescription(`Announcement has been sent in ${guildChannel}!`)
            .setColor('GREEN')
        await interaction.reply({embeds: [response], ephemeral: true})
    }
})