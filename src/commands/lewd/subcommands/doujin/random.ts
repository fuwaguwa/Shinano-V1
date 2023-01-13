import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from "node-fetch";
import { config } from "dotenv";
import { displayDoujin, getDoujinTags } from "../../../../lib/Doujin";
config();

export async function doujinRandom(interaction: ShinanoInteraction) {
	// Getting doujin
	const getRandomDoujin = async () => {
		const randomCode = Math.floor(Math.random() * 400000);
		const response = await fetch(
			`${process.env.nhentaiIP}/api/gallery/${randomCode}`,
			{ method: "GET" }
		);
		return await response.json();
	};
	let doujin = await getRandomDoujin();

	// Filter
	const tagInfo = getDoujinTags(doujin);
	const filter = tagInfo.tags.find((tag) => {
		return (
			tag.includes("Lolicon") ||
			tag.includes("Guro") ||
			tag.includes("Scat") ||
			tag.includes("Insect") ||
			tag.includes("Shotacon") ||
			tag.includes("Amputee") ||
			tag.includes("Vomit") ||
			tag.includes("Vore")
		);
	});

	// Display
	if (filter) doujin = await getRandomDoujin();
	await displayDoujin(interaction, doujin);
}
