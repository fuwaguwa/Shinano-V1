import { Guild, MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../../typings/Command";
import { client } from "../../../../..";

export async function devInspectGuild(interaction: ShinanoInteraction) {
	const guild: Guild = await client.guilds.fetch(
		interaction.options.getString("guild-id")
	);

	if (!guild)
	{
		const noResult: MessageEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("❌ | No guild of that ID can be found!");
		return interaction.editReply({ embeds: [noResult] });
	}

	const botMembers = guild.members.cache.filter((member) => member.user.bot);
	function guildTier(guild: Guild) {
		if (guild.premiumTier === "NONE") return "**None**";
		if (guild.premiumTier === "TIER_1") return "**Tier 1**";
		if (guild.premiumTier === "TIER_2") return "**Tier 2**";
		return "**Tier 3**";
	}

	const guildEmbed = new MessageEmbed()
		.setTitle(`${guild.name}`)
		.setFields(
			{
				name: "Registered",
				value: `<t:${Math.floor(new Date(guild.createdAt).getTime() / 1000)}>`,
			},
			{ name: "Current Owner", value: `<@${guild.ownerId}>` },
			{
				name: "Boost Status",
				value: `${guildTier(guild)} [${guild.premiumSubscriptionCount}/14]`,
			},
			{
				name: "Role Count",
				value: `**${guild.name}** has **${guild.roles.cache.size} roles**.`,
			},
			{
				name: "Member Count",
				value: `**${guild.memberCount} Members** | **${guild.memberCount - botMembers.size
					} Users** and **${botMembers.size}** Bots`,
			}
		)
		.setColor("#548ed1")
		.setFooter({ text: `Guild ID: ${guild.id}` });
	if (guild.iconURL())
		guildEmbed.setThumbnail(guild.iconURL({ dynamic: true, size: 512 }));
	await interaction.editReply({ embeds: [guildEmbed] });
}
