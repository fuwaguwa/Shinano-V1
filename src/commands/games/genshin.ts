import { Command } from "../../structures/Command";
import { genshinArtifact } from "./subcommands/genshin/artifact";
import { genshinCharacter } from "./subcommands/genshin/character";
import { genshinEnemy } from "./subcommands/genshin/enemies";
import { genshinMaterial } from "./subcommands/genshin/material";
import { genshinWeapon } from "./subcommands/genshin/weapon";

export default new Command({
	name: "genshin",
	description: "Get information related to Genshin!",
	cooldown: 5000,
	category: "GenshinImpact",
	options: [
		{
			type: "SUB_COMMAND",
			name: "artifact",
			description: "Get information about a Genshin artifact set!",
			options: [
				{
					type: "STRING",
					required: true,
					name: "artifact-name",
					description: "The name of an artifact set.",
				},
			],
		},
		{
			type: "SUB_COMMAND",
			name: "material",
			description: "Get information about a Genshin material.",
			options: [
				{
					type: "STRING",
					required: true,
					name: "material-name",
					description: "The material name.",
				},
			],
		},
		{
			type: "SUB_COMMAND_GROUP",
			name: "character",
			description: "Get information about a Genshin character.",
			options: [
				{
					type: "SUB_COMMAND",
					name: "info",
					description:
						"Information about a Genshin character (General Info, Constellations, Ascension Costs).",
					options: [
						{
							type: "STRING",
							required: true,
							name: "character-name",
							description: "The character's name.",
						},
					],
				},
				{
					type: "SUB_COMMAND",
					name: "stats",
					description: "Stats of a Genshin character.",
					options: [
						{
							type: "STRING",
							required: true,
							name: "character-name",
							description: "The character's name.",
						},
						{
							type: "INTEGER",
							required: true,
							name: "character-level",
							description: "The character's level.",
						},
						{
							type: "STRING",
							name: "ascension-phase",
							description: "The character's ascension phase.",
							choices: [
								{ name: "1", value: "1" },
								{ name: "2", value: "2" },
								{ name: "3", value: "3" },
								{ name: "4", value: "4" },
								{ name: "5", value: "5" },
								{ name: "6", value: "6" },
							],
						},
					],
				},
				{
					type: "SUB_COMMAND",
					name: "talents",
					description:
						"Get information about a Genshin character talents (General Info, Talent Costs).",
					options: [
						{
							type: "STRING",
							required: true,
							name: "character-name",
							description:
								"The character's name (Tip: Use 'Traveler <Element>' for the info on the Traveler)",
						},
					],
				},
			],
		},
		{
			type: "SUB_COMMAND_GROUP",
			name: "weapon",
			description: "Get information about a Genshin weapon.",
			options: [
				{
					type: "SUB_COMMAND",
					name: "info",
					description: "Information about a weapon from Genshin.",
					options: [
						{
							type: "STRING",
							required: true,
							name: "weapon-name",
							description: "The weapon's name.",
						},
					],
				},
				{
					type: "SUB_COMMAND",
					name: "stats",
					description: "Stats of a weapon from Genshin.",
					options: [
						{
							type: "STRING",
							required: true,
							name: "weapon-name",
							description: "The weapon's name.",
						},
						{
							type: "INTEGER",
							required: true,
							name: "weapon-level",
							description: "The weapon's level.",
						},
						{
							type: "STRING",
							name: "ascension-phase",
							description: "The weapon's ascension phase.",
							choices: [
								{ name: "1", value: "1" },
								{ name: "2", value: "2" },
								{ name: "3", value: "3" },
								{ name: "4", value: "4" },
								{ name: "5", value: "5" },
								{ name: "6", value: "6" },
							],
						},
						{
							type: "STRING",
							name: "refinement-level",
							description: "The weapon's ascension phase.",
							choices: [
								{ name: "1", value: "1" },
								{ name: "2", value: "2" },
								{ name: "3", value: "3" },
								{ name: "4", value: "4" },
								{ name: "5", value: "5" },
							],
						},
					],
				},
			],
		},
		{
			type: "SUB_COMMAND_GROUP",
			name: "enemy",
			description: "Get information about a Genshin enemy.",
			options: [
				{
					type: "SUB_COMMAND",
					name: "info",
					description: "Get general information about a Genshin enemy.",
					options: [
						{
							type: "STRING",
							required: true,
							name: "enemy-name",
							description: "The enemy's name.",
						},
					],
				},
				{
					type: "SUB_COMMAND",
					name: "stats",
					description: "Get a Genshin enemy's stats.",
					options: [
						{
							type: "STRING",
							required: true,
							name: "enemy-name",
							description: "The enemy's name.",
						},
						{
							type: "INTEGER",
							required: true,
							name: "enemy-level",
							description: "The enemy's level.",
						},
					],
				},
			],
		},
	],
	run: async ({ interaction }) => {
		await interaction.deferReply();
		if (interaction.options["_group"])
		{
			switch (interaction.options.getSubcommandGroup())
			{
				case "character": {
					await genshinCharacter(interaction);
					break;
				}

				case "weapon": {
					await genshinWeapon(interaction);
					break;
				}

				case "enemy": {
					await genshinEnemy(interaction);
					break;
				}
			}
		} else
		{
			switch (interaction.options.getSubcommand())
			{
				case "material": {
					await genshinMaterial(interaction);
					break;
				}

				case "artifact": {
					await genshinArtifact(interaction);
					break;
				}
			}
		}
	},
});
