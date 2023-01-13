import { MessageEmbed } from "discord.js";
import { client } from "../../../..";
import { ShinanoInteraction } from "../../../../typings/Command";

export async function devLeave(interaction: ShinanoInteraction) {
	try
	{
		const guild = await client.guilds.fetch(
			interaction.options.getString("guild-id")
		);
		await guild.leave();

		const left: MessageEmbed = new MessageEmbed()
			.setColor("GREEN")
			.setDescription(`Shinano has left \`${guild.name}\``);
		await interaction.editReply({ embeds: [left] });
	} catch (err)
	{
		const fail: MessageEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("An error has occured!");
		await interaction.editReply({ embeds: [fail] });
	}
}
