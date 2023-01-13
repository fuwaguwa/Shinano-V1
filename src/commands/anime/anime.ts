import { Command } from "../../structures/Command";
import { config } from "dotenv";
import { animeSearch } from "./subcommands/anime/search";
import { animeCharacter } from "./subcommands/anime/character";
import { animeRandom } from "./subcommands/anime/random";
import { animeQuote } from "./subcommands/anime/quote";
config();

export default new Command({
	name: "anime",
	description: "Get information about animes and its characters!",
	cooldown: 4500,
	category: "Anime",
	options: [
		{
			type: "SUB_COMMAND",
			name: "search",
			description: "Search up information of an anime on MyAnimeList",
			options: [
				{
					type: "STRING",
					required: true,
					name: "name",
					description: "The anime's name (Japanese name is recommended).",
				},
				{
					type: "STRING",
					required: true,
					name: "type",
					description: "The type of the anime",
					choices: [
						{ name: "TV", value: "tv" },
						{ name: "Movie", value: "movie" },
						{ name: "OVA (Original Video Animation)", value: "ova" },
						{ name: "ONA (Original Net Animation)", value: "ona" },
					],
				},
			],
		},
		{
			type: "SUB_COMMAND",
			name: "character",
			description: "Search up information of an anime character on MyAnimeList",
			options: [
				{
					type: "STRING",
					required: true,
					name: "name",
					description: "The character name.",
				},
			],
		},
		{
			type: "SUB_COMMAND",
			name: "quote",
			description:
				"Send you an edgy, funny, motivational or straight up random anime quote.",
		},
		{
			type: "SUB_COMMAND",
			name: "random",
			description: "Return a random anime.",
		},
	],
	run: async ({ interaction }) => {
		await interaction.deferReply();
		switch (interaction.options.getSubcommand())
		{
			case "search": {
				await animeSearch(interaction);
				break;
			}

			case "character": {
				await animeCharacter(interaction);
				break;
			}

			case "random": {
				await animeRandom(interaction);
				break;
			}

			case "quote": {
				await animeQuote(interaction);
				break;
			}
		}
	},
});
