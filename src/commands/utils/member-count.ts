import { Guild, MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: 'member-count',
    description: 'Check the server\'s member count!',
    cooldown: 4500,
    run: async({interaction}) => {
        const guild: Guild = interaction.guild
        const botMembers = guild.members.cache.filter(member => member.user.bot)

        const memberCountEmbed: MessageEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`**${guild.name}** has **${guild.memberCount} members.** | **${guild.memberCount - botMembers.size} Users** and **${botMembers.size} Bots**.`)
        await interaction.reply({embeds: [memberCountEmbed]})
    }
})