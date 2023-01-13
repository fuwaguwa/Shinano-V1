import { MessageEmbed } from "discord.js";
import { ShinanoPaginator } from "./Pages";

export async function animeInfo({ anime, interaction, menu }) {
	// Genres/Studios
	let genres: string[] = [];
	anime.genres.forEach((genre) => genres.push(genre.name));
	let studios: string[] = [];
	anime.studios.forEach((studio) =>
		studios.push(`[${studio.name}](${studio.url})`)
	);

	// Airing Time
	const startDate = Math.floor(new Date(anime.aired.from).getTime() / 1000);
	const endDate = Math.floor(new Date(anime.aired.to).getTime() / 1000);

	// Embeds
	const synopsisEmbed: MessageEmbed = new MessageEmbed()
		.setColor("#2f3136")
		.setThumbnail(anime.images.jpg.large_image_url)
		.setTitle(`${anime.title} | Synopsis`)
		.setDescription(`*${anime.synopsis || "No Sypnosis Can Be Found"}*`);
	const generalInfoEmbed: MessageEmbed = new MessageEmbed()
		.setColor("#2f3136")
		.setThumbnail(anime.images.jpg.large_image_url)
		.setTitle(`${anime.title} | General Info`)
		.addFields(
			{
				name: "MyAnimeList Info:",
				value:
					`**ID**: [${anime.mal_id}](${anime.url})\n` +
					`**Rating**: ${anime.score} ⭐\n` +
					`**Ranking**: #${anime.rank}\n` +
					`**Favorites**: ${anime.favorites}\n` +
					`**Popularity**: #${anime.popularity}\n`,
			},
			{
				name: "Anime Info:",
				value:
					`**Rating**: ${anime.rating}\n` +
					`**Genres**: ${genres.join(", ")}\n` +
					`**JP Title**: ${anime.title_japanese ? anime.title_japanese : "None"
					}\n` +
					`**Trailer**: ${anime.trailer.url ? `[Trailer Link](${anime.trailer.url})` : "None"
					}\n` +
					`**Studio**: ${studios.join(", ")}\n`,
			},
			{
				name: "Episodes Info:",
				value:
					`**Status**: ${anime.status}\n` +
					`**Episodes**: ${anime.episodes}\n` +
					`**Duration**: ${anime.duration}\n` +
					`**Start Date**: <t:${startDate}>\n` +
					`**End Date**: ${endDate == 0 ? "Ongoing Anime" : `<t:${endDate}>`
					}\n`,
			}
		);

	// Paging
	if (menu)
	{
		await ShinanoPaginator({
			interaction: interaction,
			interactorOnly: true,
			timeout: 120000,
			menu: menu,
			pages: [synopsisEmbed, generalInfoEmbed],
		});
	} else
	{
		await ShinanoPaginator({
			interaction: interaction,
			interactorOnly: true,
			timeout: 120000,
			pages: [synopsisEmbed, generalInfoEmbed],
		});
	}
}

// Character
export function characterInfo({ character, VAs }) {
	// Embed
	const characterEmbed: MessageEmbed = new MessageEmbed()
		.setColor("RANDOM")
		.setTitle(
			`${character.name} | ${character.name_kanji ? character.name_kanji : "No Kanji Name"
			}`
		)
		.setThumbnail(character.images.jpg.image_url)
		.setDescription(character.about ? character.about : "No Biography Found");

	// Validating Character Information
	if (character.anime.length != 0)
	{
		characterEmbed.addFields(
			{
				name: "Extra Info:",
				value:
					`**Anime**: [${character.anime[0].anime.title}](${character.anime[0].anime.url})\n` +
					`**Voice Actors**: ${VAs.length != 0 ? VAs.join("; ") : "None"}\n` +
					`**Nicknames**: ${character.nicknames.length != 0
						? character.nicknames.join(", ")
						: "None"
					}`,
			},
			{
				name: "MyAnimeList Info",
				value:
					`**ID**: [${character.mal_id}](${character.url})\n` +
					`**Favorites**: ${character.favorites}`,
			}
		);
	} else
	{
		characterEmbed.addField(
			"MyAnimeList Info",
			`**ID**: [${character.mal_id}](${character.url})\n` +
			`**Favorites**: ${character.favorites}`
		);
	}
	return characterEmbed;
}
