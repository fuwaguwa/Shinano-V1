import { MessageEmbed, TextChannel } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";
import { nsfwPrivateCollection } from "../../../lewd/subcommands/nsfw/privateColle";

export async function shinanoLewd(interaction: ShinanoInteraction) {
	if (!(interaction.channel as TextChannel).nsfw)
	{
		const nsfwCommand: MessageEmbed = new MessageEmbed()
			.setColor("RED")
			.setTitle("NSFW Command")
			.setDescription("NSFW commands can only be used in NSFW channels.");
		return interaction.reply({ embeds: [nsfwCommand] });
	}

	await interaction.deferReply();
	const embed = new MessageEmbed().setColor("#2f3136");

	await nsfwPrivateCollection(interaction, embed, "shinano");
}
