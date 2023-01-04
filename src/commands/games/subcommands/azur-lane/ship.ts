import { AzurAPI } from "@azurapi/azurapi";
import { MessageEmbed, MessageActionRow, MessageSelectMenu, InteractionCollector, SelectMenuInteraction, Message } from "discord.js";
import { generateStatsTable, shipColor } from "../../../../structures/AL";
import { ShinanoPaginator } from "../../../../structures/Pages";
import { toTitleCase } from "../../../../structures/Utils";
import { ShinanoInteraction } from "../../../../typings/Command";

export async function azurLaneShip(interaction: ShinanoInteraction, AL: AzurAPI) {
    // Getting information about the ship
    const shipName: string = interaction.options.getString('ship-name')
    const ship: any = await AL.ships.get(shipName)
    if (!ship) {
        const shipNotFound: MessageEmbed = new MessageEmbed()
            .setDescription('❌ | Ship not found!')
            .setColor('RED')
        return interaction.reply({embeds:[shipNotFound], ephemeral: true})
    }


    // General Info
    const color = shipColor(ship)

    await interaction.deferReply()
    const info: MessageEmbed = new MessageEmbed()
        .setTitle(`${ship.names.en} | ${ship.names.code}`)
        .setDescription(`[Wiki Link](${ship.wikiUrl})\nDrawn by ${ship.misc.artist.name}\nVoiced by ${ship.misc.voice.name ? ship.misc.voice.name : "Unknown"}`)
        .setThumbnail(ship.thumbnail)
        .setColor(color)
        .addFields(
            {name: 'Rarity:', value: ship.rarity},
            {name: 'Nationality:', value: `${ship.nationality ? ship.nationality : `None`}`},
            {name: 'Class:', value: ship.class},
            {name: 'Hull Type:', value: ship.hullType},
        )
    

    // PR Checking
    if (ship.rarity !== 'Decisive' && ship.rarity !== 'Priority') {
        const pools: string[] = []
        if (ship.construction.availableIn.exchange) pools.push('Exchange')
        if (ship.construction.availableIn.light) pools.push('Light Ship Pool');
        if (ship.construction.availableIn.heavy) pools.push('Heavy Ship Pool');
        if (ship.construction.availableIn.aviation) pools.push('Special Ship Pool');
        if (ship.construction.availableIn.limited) pools.push(`Limited Ship Pool: ${ship.construction.availableIn.limited}`);
        

        // Banner Pool
        let aprIn: string;
        pools.length > 0
            ? aprIn = pools.join('\n')
            : aprIn = 'Maps'


        // Map Pool
        const maps: string[] = []
        if (ship.obtainedFrom.fromMaps.length > 0) {
            for (let i = 0; i < ship.obtainedFrom.fromMaps.length; i++) {
                if (ship.obtainedFrom.fromMaps[i].name) {
                    maps.push(ship.obtainedFrom.fromMaps[i].name)
                } else {
                    maps.push(ship.obtainedFrom.fromMaps[i])
                }
            }   
        }

        maps.length > 0 && pools.length > 0
            ? aprIn = aprIn + `\nMaps: ${maps.join(', ')}`
            : aprIn = aprIn + `: ${maps.join(', ')}`
        

        // Adding Data
        info
            .addFields(
                {name: 'Construction:', value: ship.construction.constructionTime === 'Drop Only' ? 'Cannot Be Constructed' : ship.construction.constructionTime },
                {name: 'Appears In:', value: aprIn},
                {name: 'Obtainable From:', value: `${ship.obtainedFrom.obtainedFrom ? ship.obtainedFrom.obtainedFrom : `Other Sources (Maps/Banner)`}`}
            )
    } else {
        // PR/DR Ships
        info.addField('Obtain From:', 'Shipyard')
    }

    
    // Stats
    let name: string;
    let limitBreak: string;

    if ((!ship.limitBreaks) && (!ship.devLevels)) {
        name = 'Limit Breaks:'
        limitBreak = 'Ship cannot be limit broken.'
    } else if ((ship.limitBreaks) && (!ship.devLevels)) {
        name = 'Limit Breaks:'
        limitBreak = 
        `**First**: ${ship.limitBreaks[0].join('/')}\n` +
        `**Second**: ${ship.limitBreaks[1].join('/')}\n` +
        `**Third**: ${ship.limitBreaks[2].join('/')}\n`
    } else {
        name = 'Dev Levels:'
        limitBreak = 
        `**Dev 5**: ${ship.devLevels[0].buffs.join('/')}\n` +
        `**Dev 10**: ${ship.devLevels[1].buffs.join('/')}\n` +
        `**Dev 15**: ${ship.devLevels[2].buffs.join('/')}\n` +
        `**Dev 20**: ${ship.devLevels[3].buffs.join('/')}\n` +
        `**Dev 25**: ${ship.devLevels[4].buffs.join('/')}\n` +
        `**Dev 30**: ${ship.devLevels[5].buffs.join('/')}\n`
    }


    // Scrap/Enhance Value
    let scrapValue: string[] = []
    let enhanceValue: string[] = []

    if (ship.rarity === 'Priority' || ship.rarity === 'Decisive') {
        for (let value in ship.scrapValue) {
            scrapValue.push(
                `${toTitleCase(value)}: ${ship.scrapValue[value]}`
            )
        }

        for (let value in ship.enhanceValue) {
            enhanceValue.push(
                `${toTitleCase(value)}: ${ship.enhanceValue[value]}`
            )
        }
    }


    const statsTable = await generateStatsTable(ship.stats)
    const stats: MessageEmbed = new MessageEmbed()
        .setTitle(`${ship.names.en}'s Stats`)
        .setColor(color)
        .setImage(statsTable)
        .setThumbnail(ship.thumbnail)
        .addFields(
            {name: name, value: limitBreak},
            {name: 'Weapon Slots: MinEff%/MaxEff%: ', value: 
            `**${ship.slots[0].type}**: ${ship.slots[0].minEfficiency}%/${ship.slots[0].maxEfficiency}%\n` +
            `**${ship.slots[1].type}**: ${ship.slots[1].minEfficiency}%/${ship.slots[1].maxEfficiency}%\n` +
            `**${ship.slots[2].type}**: ${ship.slots[2].minEfficiency}%/${ship.slots[2].maxEfficiency}%`},
        )

    if (scrapValue.length != 0) {
        stats.addFields(
            {name: 'Scrap Value: ', value: scrapValue.join('\n')},
            {name: 'Enhance Value:', value: enhanceValue.join('\n')}
        )
    }
    

    // Skills
    const skills: MessageEmbed = new MessageEmbed()
        .setColor(color)
        .setThumbnail(ship.thumbnail)
        .setTitle(`${ship.names.en}'s Skills`)
    ship.skills.forEach((skill) => {
        let skillType: string

        if (skill.color === 'pink') skillType = 'Offensive Skill';
        if (skill.color === 'gold') skillType = 'Support Skill';
        if (skill.color === 'deepskyblue') skillType = 'Defensive Skill';
        
        skills.addField(`${skill.names.en} (${skillType})`, skill.description)
    })

    
    // Tech
    let techPts: string
    let statsBonus: string

    if ((!ship.fleetTech.statsBonus.collection) || (!ship.fleetTech.techPoints)) {
        techPts = 'N/A'
        statsBonus = 'N/A'
    } else {
        let collection = ship.fleetTech.statsBonus.collection.stat
        let maxLevel = ship.fleetTech.statsBonus.maxLevel.stat

        switch (collection.toLowerCase()) {
            case 'antisubmarinewarfare': {
                collection = 'ASW'
                break
            }

            case 'antiair': {
                collection = 'anti air'
                break
            }
        }

        switch (maxLevel.toLowerCase()) {
            case 'antisubmarinewarfare': {
                maxLevel = 'ASW'
                break
            }

            case 'antiair': {
                maxLevel = 'anti air'
                break
            }
        } 


        techPts = 
        `Unlocking The Ship: **${ship.fleetTech.techPoints.collection}**\n` +
        `Max Limit Break: **${ship.fleetTech.techPoints.maxLimitBreak}**\n` +
        `Reaching Level 120: **${ship.fleetTech.techPoints.maxLevel}**\n` +
        `Total Tech Points: **${ship.fleetTech.techPoints.total}**`

        statsBonus = 
        `Unlocking The Ship: ${ship.fleetTech.statsBonus.collection.bonus} **${collection}** for ${toTitleCase(ship.fleetTech.statsBonus.collection.applicable.join(', '))}s\n\n` +
        `Reaching Level 120: ${ship.fleetTech.statsBonus.maxLevel.bonus} **${maxLevel}** for ${toTitleCase(ship.fleetTech.statsBonus.maxLevel.applicable.join(', '))}s`
    }

    const tech: MessageEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${ship.names.en}'s Fleet Stats`)
        .setThumbnail(ship.thumbnail)
        .addFields(
            {name: 'Tech Points:', value: techPts},
            {name: 'Stats Bonus:', value: statsBonus}
        )


    // Skins
    const skinEmbeds: MessageEmbed[] = []
    let description: string;

    ship.skins.forEach((skin) => {
        if (skin.info.obtainedFrom === 'Skin Shop') {
            description = 
            `**Skin Name**: ${skin.name}\n` +
            `**Obtain From**: Skin Shop\n` +
            `**Cost**: ${skin.info.cost} <:GEAMS:1002198674539036672>\n` +
            `**Live2D?** ${skin.info.live2dModel == false ? 'No' : 'Yes'}\n` +
            `**Limited or Permanent**: ${!skin.info.enLimited ? `${skin.info.enClient} on EN.` : skin.info.enLimited}`
        } else if (skin.info.obtainedFrom === 'Default') {
            description = `**Skin Name**: ${skin.name}`
        } else {
            description = 
            `**Skin Name**: ${skin.name}\n ` +
            `**Obtain From**: ${skin.info.obtainedFrom}\n`
        }

        skinEmbeds.push(
            new MessageEmbed()
                .setTitle(`${ship.names.en}'s Skins`)
                .setDescription(description)
                .setColor(color)
                .setImage(skin.bg ? skin.bg : skin.image)
                .setThumbnail(skin.chibi)
        )
    })

    
    // Selection Menu
    const category = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setPlaceholder('Categories')
                .setDisabled(false)
                .setCustomId(`${shipName}-${interaction.user.id}`)
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(
                    {
                        label: 'Info',
                        value: 'info',
                        default: true,
                        emoji: '🔍'
                    },
                    {
                        label: 'Tech',
                        value: 'tech',
                        default: false,
                        emoji: '🛠'
                    },
                    {
                        label: 'Stats',
                        value: 'stats',
                        default: false,
                        emoji: '🚢'
                    },
                    {
                        label: 'Skills',
                        value: 'skills',
                        default: false,
                        emoji: '📚'
                    },
                    {
                        label: 'Skins',
                        value: 'skins',
                        default: false,
                        emoji: '<:GEAMS:1002198674539036672>'
                    }
                )
        )


    // Gallery
    const galleryEmbeds: MessageEmbed[] = []
    if (ship.gallery.length != 0) {
        // Generating Embeds
        if (ship.gallery.length != 0) {
            ship.gallery.forEach((image) => {
                galleryEmbeds.push(
                    new MessageEmbed()
                        .setColor(color)
                        .setTitle(`${ship.names.en}'s Image Gallery`)
                        .setDescription(`[${image.description}](${image.url})`)
                        .setImage(image.url)
                )
            })
        };

        // Adding Options
        (category.components[0] as MessageSelectMenu).addOptions(
            {
                label: 'Gallery',
                value: 'gallery',
                default: false,
                emoji: '📸'
            }
        )
    }


    // Collector 
    const message = await interaction.editReply({embeds:[info], components: [category]})
    const collector = await (message as Message).createMessageComponentCollector({
        time: 120000,
    })
    let skinPage: any = 0

    collector.on('collect', async (i) => {
        const customID = i.customId.split('-')[0]
        if (customID === shipName) {
            // Verifying interaction
            if (!i.customId.endsWith(`${i.user.id}`)) {
                return i.reply({
                    content: 'This menu is not for you!',
                    ephemeral: true
                })
            }
            

            // Handling selection
            if (i['values']) {
                await i.deferUpdate()
                switch (i['values'][0]) {
                    case 'info': {
                        for (let i = 0; i < (category.components[0] as MessageSelectMenu).options.length; i++) {
                            i == 0
                                ? (category.components[0] as MessageSelectMenu).options[i].default = true
                                : (category.components[0] as MessageSelectMenu).options[i].default = false
                        }

                        await i.editReply({
                            embeds: [info],
                            components:[category]
                        })
                        break
                    }


                    case 'tech': {
                        for (let i = 0; i < (category.components[0] as MessageSelectMenu).options.length; i++) {
                            i == 1
                                ? (category.components[0] as MessageSelectMenu).options[i].default = true
                                : (category.components[0] as MessageSelectMenu).options[i].default = false
                        }

                        await i.editReply({
                            embeds: [tech],
                            components:[category]
                        })
                        break
                    }
                    

                    case 'stats': {
                        for (let i = 0; i < (category.components[0] as MessageSelectMenu).options.length; i++) {
                            i == 2
                                ? (category.components[0] as MessageSelectMenu).options[i].default = true
                                : (category.components[0] as MessageSelectMenu).options[i].default = false
                        }

                        await i.editReply({
                            embeds: [stats],
                            components: [category]
                        })
                        break
                    }


                    case 'skills': {
                        for (let i = 0; i < (category.components[0] as MessageSelectMenu).options.length; i++) {
                            i == 3
                                ? (category.components[0] as MessageSelectMenu).options[i].default = true
                                : (category.components[0] as MessageSelectMenu).options[i].default = false
                        }

                        await i.editReply({
                            embeds: [skills],
                            components:[category]
                        })
                        break
                    }


                    case 'skins': {
                        for (let i = 0; i < (category.components[0] as MessageSelectMenu).options.length; i++) {
                            i == 4
                                ? (category.components[0] as MessageSelectMenu).options[i].default = true
                                : (category.components[0] as MessageSelectMenu).options[i].default = false
                        }

                        if (skinEmbeds.length === 1) {
                            await i.editReply({
                                embeds: [skinEmbeds[0]],
                                components: [category]
                            })
                        } else {
                            skinPage = await ShinanoPaginator({
                                interaction: interaction,
                                pages: skinEmbeds,
                                interactorOnly: true,
                                page: skinPage,
                                timeout: 120000,
                                menu: category,
                            })
                        }
                        break
                    }


                    case 'gallery': {
                        for (let i = 0; i < (category.components[0] as MessageSelectMenu).options.length; i++) {
                            i == 5
                                ? (category.components[0] as MessageSelectMenu).options[i].default = true
                                : (category.components[0] as MessageSelectMenu).options[i].default = false
                        }

                        if (galleryEmbeds.length === 1) {
                            await i.editReply({
                                embeds: [galleryEmbeds[0]],
                                components: [category]
                            })
                        } else {
                            await ShinanoPaginator({
                                interaction: interaction,
                                pages: galleryEmbeds,
                                interactorOnly: true,
                                timeout: 120000,
                                menu: category,
                            })
                        }
                        break
                    }
                }
            }
        }

        collector.resetTimer()
    })
    
    collector.on('end', async (collected, reason) => {
        (category.components[0] as MessageSelectMenu).setDisabled(true)
        await interaction.editReply({components:[category]})
    })
}