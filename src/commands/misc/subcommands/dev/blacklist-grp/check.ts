import { MessageEmbed } from "discord.js";
import User from "../../../../../schemas/User";
import { ShinanoInteraction } from "../../../../../typings/Command";

export async function blacklistCheck(interaction: ShinanoInteraction) {
	const user = await User.findOne({
		userId: interaction.options.getUser("user").id,
	});
	if (user.blacklisted == true)
	{
		const blacklisted: MessageEmbed = new MessageEmbed()
			.setColor("RED")
			.setTitle("Uh oh, user is blacklisted!")
			.addFields({
				name: "User:",
				value: `${interaction.options.getUser("user")}`,
			});
		await interaction.editReply({ embeds: [blacklisted] });
	} else
	{
		const noOne: MessageEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("User is not blacklisted!");
		await interaction.editReply({ embeds: [noOne] });
	}
}
