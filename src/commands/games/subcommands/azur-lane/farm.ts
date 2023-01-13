import { MessageEmbed } from "discord.js";
import { getALEXPTable, shipColor } from "../../../../lib/AL";
import { ShinanoInteraction } from "../../../../typings/Command";

export async function azurLaneFarm(interaction: ShinanoInteraction, AL: any) {
	await interaction.deferReply();

	// Filtering Data
	const shipName: string = interaction.options
		.getString("ship-name")
		.toLowerCase();
	const chapterNum: string = interaction.options.getString("chapter");
	const stageNum: string = interaction.options.getString("stage");
	let flagshipStatus: boolean = interaction.options.getBoolean("flagship");

	let expMultiplier: number = 0;
	let cLevel: number = interaction.options.getInteger("current-level");
	let tLevel: number = interaction.options.getInteger("target-level");

	if (cLevel > 125) cLevel = 125;
	if (tLevel > 125) tLevel = 125;
	if (cLevel == tLevel || tLevel < cLevel)
	{
		const invalid: MessageEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("❌ | Invalid input for levels!");
		return interaction.editReply({ embeds: [invalid] });
	}

	const ship = await AL.ships.get(shipName);
	if (!ship)
	{
		const shipNotFound: MessageEmbed = new MessageEmbed()
			.setDescription("❌ | Ship not found!")
			.setColor("RED");
		return interaction.reply({ embeds: [shipNotFound], ephemeral: true });
	}

	if (!flagshipStatus) flagshipStatus = false;
	if (flagshipStatus)
	{
		const flagshipHullType = [
			"Battleship",
			"Battlecruiser",
			"Monitor",
			"Aircraft Carrier",
			"Light Aircraft Carrier",
			"Repair",
			"Aviation Battleship",
		];
		if (flagshipHullType.includes(ship.hullType)) expMultiplier = 0.5;
	}

	const chapter = AL.chapters.filter((chapter) => {
		return chapter.id === chapterNum;
	});
	const stage = chapter[0][stageNum].normal;

	// Calculation
	// EXP Calc
	let rarity: string = "normal";
	if (ship.rarity === "Ultra Rare" || ship.rarity === "Decisive")
		rarity = "ultra rare";

	let data = await getALEXPTable();
	rarity === "normal" ? (data = data.normal) : (data = data.ultraRare);
	const expDifference = data[tLevel - 1] - data[cLevel - 1];

	// Stage EXP Stats
	let avgExpIncomeMob =
		(stage.baseXP.smallFleet +
			stage.baseXP.mediumFleet +
			stage.baseXP.largeFleet) /
		3;
	avgExpIncomeMob = Math.round(
		avgExpIncomeMob * expMultiplier + avgExpIncomeMob
	);
	const bossExp =
		stage.baseXP.bossFleet + stage.baseXP.bossFleet * expMultiplier;

	const avgExpFromClearingMobs = Math.round(
		avgExpIncomeMob * stage.requiredBattles
	);
	const avgExpFromClearingAll = Math.round(avgExpFromClearingMobs + bossExp);

	const mvpExpMob = avgExpFromClearingMobs * 2;
	const mvpExpAll = avgExpFromClearingAll * 2;
	const mvpExpPerBattle = avgExpIncomeMob * 2;

	// Farm Stats
	const battleNeeded = Math.ceil(expDifference / avgExpIncomeMob);
	const mobClearNeeded = Math.ceil(expDifference / avgExpFromClearingMobs);
	const allClearNeeded = Math.ceil(expDifference / avgExpFromClearingAll);

	const battleNeededMvp = Math.ceil(expDifference / mvpExpPerBattle);
	const mobClearNeededMvp = Math.ceil(expDifference / mvpExpMob);
	const allClearNeededMvp = Math.ceil(expDifference / mvpExpAll);

	// Displaying data
	const infoEmbed: MessageEmbed = new MessageEmbed()
		.setColor(shipColor(ship))
		.setThumbnail(ship.thumbnail)
		.setTitle(`${ship.names.en} | Farming at ${chapterNum}-${stageNum}`)
		.addFields(
			{
				name: "Ship Stats:",
				value:
					`Rarity: **${ship.rarity}**\n` +
					`Flagship: **${flagshipStatus}**\n` +
					`Current Level: **${cLevel}**\n` +
					`Target Level: **${tLevel}**\n` +
					`EXP To Reach Target: **${expDifference.toLocaleString()}**`,
				inline: true,
			},
			{
				name: "Stage Stats:",
				value:
					`Stage: **${chapterNum}-${stageNum}**\n` +
					`Mob Level: **${stage.enemyLevel.mobLevel}**\n` +
					`Boss Level: **${stage.enemyLevel.bossLevel}**`,
				inline: true,
			},
			{
				name: "EXP Stats:",
				value:
					`EXP/boss: **${bossExp}**\n` +
					`EXP/sortie: **${avgExpIncomeMob}**\n` +
					`EXP/sortie (w/MVP): **${mvpExpPerBattle}**\n\n` +
					`EXP/clear (Mobs Only): **${avgExpFromClearingMobs}**\n` +
					`EXP/clear (All Fleets): **${avgExpFromClearingAll}**\n\n` +
					`EXP/clear (Mob Only) (w/MVP): **${mvpExpMob}**\n` +
					`EXP/clear (All Fleets) (w/MVP): **${mvpExpAll}**`,
			},
			{
				name: "Requirements:",
				value:
					`Sortie Needed: **${battleNeeded}**\n` +
					`Clear Needed (Mobs Only): **${mobClearNeeded}**\n` +
					`Clear Needed (All Enemies): **${allClearNeeded}**\n\n` +
					`Sortie Needed (w/MVP): **${battleNeededMvp}**\n` +
					`Clear Needed (Mobs Only) (w/MVP): **${mobClearNeededMvp}**\n` +
					`Clear Needed (All Enemies) (w/MVP): **${allClearNeededMvp}**`,
				inline: true,
			}
		)
		.setFooter({ text: "Numbers are averages and may vary in-game" });
	await interaction.editReply({ embeds: [infoEmbed] });
}
