import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from "node-fetch";

export async function nsfwFanboxBomb(interaction: ShinanoInteraction) {
	let category = interaction.options.getString("category") || "random";

	category === "random"
		? (category = "")
		: (category = `?category=${category}`);

	const response = await fetch(
		`https://AmagiAPI.fuwafuwa08.repl.co/nsfw/fanbox-bomb${category}`,
		{
			method: "GET",
			headers: {
				Authorization: process.env.amagiApiKey,
			},
		}
	);
	const waifu = await response.json();

	return interaction.editReply({
		content: waifu.links.map((item) => item.link).join("\n"),
	});
}
