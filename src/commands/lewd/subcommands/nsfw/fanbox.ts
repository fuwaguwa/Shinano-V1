import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";
import Collection from "../../../../schemas/PrivateCollection";

export async function nsfwPrivateFanbox(
	interaction: ShinanoInteraction,
	lewdEmbed: MessageEmbed
) {
	const tags = [
		"elf",
		"genshin",
		"kemonomimi",
		"shipgirls",
		"undies",
		"misc",
		"uniform",
	];
	const tag =
		interaction.options.getString("fanbox-category") ||
		tags[Math.floor(Math.random() * tags.length)];

	const data = await Collection.findOne({ type: tag });
	const response = data.links.filter((item) => item.link.includes("_FANBOX"));
	const item = response[Math.floor(Math.random() * response.length)];

	lewdEmbed.setImage(item.link);
	const imageLink = new MessageActionRow().addComponents(
		new MessageButton()
			.setStyle("LINK")
			.setEmoji("🔗")
			.setLabel("Image Link")
			.setURL(item.link)
	);
	return interaction.editReply({
		embeds: [lewdEmbed],
		components: [imageLink],
	});
}
