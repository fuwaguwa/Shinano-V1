import { Command } from "../../structures/Command";
import { SauceNao } from "saucenao.js";
import { MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import { isImageAndGif } from "../../lib/Utils";
import { config } from "dotenv";
import fetch from "node-fetch";
config();

const sauce: SauceNao = new SauceNao({ api_key: process.env.saucenaoApiKey });

export default new Command({
	name: "sauce",
	description: "Get the sauce for an image.",
	nsfw: true,
	cooldown: 5000,
	category: "NSFW",
	options: [
		{
			type: "SUB_COMMAND",
			name: "link",
			description: "Get the sauce for an image/gif with a raw link.",
			options: [
				{
					type: "STRING",
					name: "link",
					description: "RAW image link.",
					required: true,
				},
			],
		},
		{
			type: "SUB_COMMAND",
			name: "file",
			description: "Get the sauce for an image/gif by uploading it.",
			options: [
				{
					type: "ATTACHMENT",
					name: "image",
					description: "Image.",
					required: true,
				},
			],
		},
	],
	run: async ({ interaction }) => {
		// Link Validation
		await interaction.deferReply();
		let wait: MessageEmbed = new MessageEmbed()
			.setTitle("Processing...")
			.setColor("GREEN")
			.setDescription(
				"<a:lod:1021265223707000923> | Validating Link...\n<a:lod:1021265223707000923> | Searching For Sauce...\n<a:lod:1021265223707000923> | Filtering..."
			);
		await interaction.editReply({ embeds: [wait] });

		let link: string;
		interaction.options.getSubcommand() === "link"
			? (link = interaction.options.getString("link"))
			: (link = interaction.options.getAttachment("image").proxyURL);

		if (!isImageAndGif(link))
		{
			const failed: MessageEmbed = new MessageEmbed()
				.setColor("RED")
				.setDescription("Must be an image/gif!");
			return interaction.editReply({ embeds: [failed] });
		}

		const response = await fetch(link);
		if (response.status !== 200)
		{
			const failed: MessageEmbed = new MessageEmbed()
				.setColor("RED")
				.setDescription("Invalid image/gif link/file.");
			return interaction.editReply({ embeds: [failed] });
		}

		// Sauce Searching
		wait.setDescription(
			"✅ | Valid Link!\n<a:lod:1021265223707000923> | Searching For Sauce...\n<a:lod:1021265223707000923> | Filtering..."
		);
		await interaction.editReply({ embeds: [wait] });

		const emojis = {
			Pixiv: "<:pixiv:1003211984747118642>",
			Twitter: "<:twitter:1003211986697453680>",
			Danbooru: "<:danbooru:1003212182156230686>",
			Gelbooru: "<:gelbooru:1003211988916252682>",
			"Yande.re": "🔪",
			Konachan: "⭐",
			Fantia: "<:fantia:1003211990673670194>",
			AniDB: "<:anidb:1003211992410107924>",
		};

		sauce.find({ url: link }).then(async (sauce) => {
			if (sauce.results.length == 0)
			{
				const noResult: MessageEmbed = new MessageEmbed()
					.setColor("RED")
					.setDescription("❌ | No result was found...")
					.setImage(
						"https://cdn.discordapp.com/attachments/977409556638474250/999486337822507058/akairo-azur-lane.gif"
					);
				return interaction.editReply({ embeds: [noResult] });
			}

			let result: MessageEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Sauce...Found?")
				.setThumbnail(sauce.results[0].header.thumbnail);
			if (
				sauce.results[0].data.source &&
				sauce.results[0].header.index_name.includes("H-Anime")
			)
			{
				result.addField("Sauce: ", sauce.results[0].data.source);
				result.addField(
					"Estimated Timestamp: ",
					sauce.results[0].data.est_time
				);
			} else
			{
				if (sauce.results[0].data.member_name)
					result.addField("Artist: ", sauce.results[0].data.member_name);
				if (sauce.results[0].data.creator)
					result.addField("Artist: ", `${sauce.results[0].data.creator}`);
				if (sauce.results[0].data.material)
					result.addField("Material: ", sauce.results[0].data.material);
				if (sauce.results[0].data.characters)
					result.addField("Character: ", sauce.results[0].data.characters);
				if (sauce.results[0].data.user_name)
					result.addField("Artist: ", sauce.results[0].data.user_name);
			}

			// Extracting Links
			const links: string[] = [];
			for (let i = 0; i < 5; i++)
			{
				const source = sauce.results[i];

				if (!source) return;
				if (source.data.ext_urls)
				{
					links.push(`${source.data.ext_urls[0]}|${source.header.similarity}%`);
				}
			}
			wait.setDescription(
				"✅ | Valid Link!\n✅ | Sauce Found!\n<a:lod:1021265223707000923> | Filtering..."
			);
			await interaction.editReply({ embeds: [wait] });

			// Filtering
			let filteredLink = {};
			for (let i = 0; i < links.length; i++)
			{
				switch (true)
				{
					case links[i].includes("pixiv.net"): {
						if (!filteredLink["Pixiv"])
						{
							filteredLink["Pixiv"] = links[i];
						}
						break;
					}

					case links[i].includes("danbooru.donmai.us"): {
						if (!filteredLink["Danbooru"])
						{
							filteredLink["Danbooru"] = links[i];
						}
						break;
					}

					case links[i].includes("gelbooru.com"): {
						if (!filteredLink["Gelbooru"])
						{
							filteredLink["Gelbooru"] = links[i];
						}
						break;
					}

					case links[i].includes("konachan.com"): {
						if (!filteredLink["Konachan"])
						{
							filteredLink["Konachan"] = links[i];
						}
						break;
					}

					case links[i].includes("yande.re"): {
						if (!filteredLink["Yande.re"])
						{
							filteredLink["Yande.re"] = links[i];
						}
						break;
					}

					case links[i].includes("fantia.jp"): {
						if (!filteredLink["Fantia"])
						{
							filteredLink["Fantia"] = links[i];
						}
						break;
					}

					case links[i].includes("anidb.net"): {
						if (!filteredLink["AniDB"])
						{
							filteredLink["AniDB"] = links[i];
						}
						break;
					}
				}
			}
			if (Object.keys(filteredLink).length == 0)
				return interaction.editReply({ embeds: [result] });

			// Linking
			const sauceUrls: MessageActionRow = new MessageActionRow();
			for (let link in filteredLink)
			{
				switch (link)
				{
					case "Pixiv": {
						sauceUrls.addComponents(
							new MessageButton()
								.setLabel(`Pixiv (${filteredLink[link].split("|")[1]})`)
								.setStyle("LINK")
								.setEmoji(emojis["Pixiv"])
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}

					case "Danbooru": {
						sauceUrls.addComponents(
							new MessageButton()
								.setLabel(`Danbooru (${filteredLink[link].split("|")[1]})`)
								.setStyle("LINK")
								.setEmoji(emojis["Danbooru"])
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}

					case "Gelbooru": {
						sauceUrls.addComponents(
							new MessageButton()
								.setLabel(`Gelbooru (${filteredLink[link].split("|")[1]})`)
								.setStyle("LINK")
								.setEmoji(emojis["Gelbooru"])
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}

					case "Konachan": {
						sauceUrls.addComponents(
							new MessageButton()
								.setLabel(`Konachan (${filteredLink[link].split("|")[1]})`)
								.setStyle("LINK")
								.setEmoji(emojis["Konachan"])
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}

					case "Yande.re": {
						sauceUrls.addComponents(
							new MessageButton()
								.setLabel(`Yande.re (${filteredLink[link].split("|")[1]})`)
								.setStyle("LINK")
								.setEmoji(emojis["Yande.re"])
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}

					case "Fantia": {
						sauceUrls.addComponents(
							new MessageButton()
								.setLabel(`Fantia (${filteredLink[link].split("|")[1]})`)
								.setStyle("LINK")
								.setEmoji(emojis["Fantia"])
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}

					case "AniDB": {
						sauceUrls.addComponents(
							new MessageButton()
								.setLabel(`AniDB (${filteredLink[link].split("|")[1]})`)
								.setStyle("LINK")
								.setEmoji(emojis["AniDB"])
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}
				}
			}

			// Finishing Up
			wait.setDescription(
				"✅ | Valid Link!\n✅ | Sauce Found!\n✅ | Filtered!"
			);
			await interaction.editReply({ embeds: [wait] });

			if (sauceUrls.components.length === 0)
			{
				result.setDescription(
					`Similarity: ${sauce.results[0].header.similarity}%`
				);
				return interaction.editReply({ embeds: [result] });
			}
			result.setFooter({ text: "Similarity is displayed below." });
			return interaction.editReply({
				embeds: [result],
				components: [sauceUrls],
			});
		});
	},
});
