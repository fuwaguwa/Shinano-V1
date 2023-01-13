import { MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../../typings/Command";
import News from "../../../../../schemas/ALNews";

export async function azurLaneNewsStop(interaction: ShinanoInteraction) {
	await interaction.deferReply();

	const dbChannel = await News.findOne({ guildId: interaction.guild.id });
	if (!dbChannel) {
		const none: MessageEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription(
				`❌ | You haven't set-up Shinano to send news/tweets into any channel yet!`
			);
		return interaction.editReply({ embeds: [none] });
	}

	dbChannel.deleteOne({ guildId: interaction.guild.id });
	const deleted: MessageEmbed = new MessageEmbed()
		.setColor("GREEN")
		.setDescription(
			`✅ | Shinano will no longer send news/tweets into the server!`
		);
	await interaction.editReply({ embeds: [deleted] });
}
