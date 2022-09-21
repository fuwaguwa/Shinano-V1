import { Command } from "../../structures/Command";
import { AzurAPI } from "@azurapi/azurapi";
import { InteractionCollector, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { ShinanoPaginator } from "../../structures/Pages";
import { toTitleCase } from "../../structures/Utils";
import { Table } from "embed-table";
import fetch from 'node-fetch'
import { config } from 'dotenv'
config()
const AL = new AzurAPI();
 
export default new Command({
    name: 'azur-lane',
    description: 'Get info about an Azur Lane ship!',
    cooldown: 5000,
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'ship',
            description: 'Get information about an Azur Lane ship!',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'ship-name',
                    description: 'Ship\'s Name'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'chapter',
            description: 'Get information about an Azur Lane chapter!',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'chapter-number',
                    description: 'Chapter Number',
                    choices: [
                        {name:'Chapter 1: Tora! Tora! Tora!', value: '1'},
                        {name:'Chapter 2: Battle of the Coral Sea', value: '2'},
                        {name:'Chapter 3: Midway Showdown', value: '3'},
                        {name:'Chapter 4: Solomon\'s Nightmare Pt.1', value: '4'},
                        {name:'Chapter 5: Solomon\'s Nightmare Pt.2', value: '5'},
                        {name:'Chapter 6: Solomon\'s Nightmare Pt.3', value: '6'},
                        {name:'Chapter 7: Night of Chaos', value: '7'},
                        {name:'Chapter 8: Battle Komandorski', value: '8'},
                        {name:'Chapter 9: Battle of Kula Gulf', value: '9'},
                        {name:'Chapter 10: Battle of Kolombangara', value: '10'},
                        {name:'Chapter 11: Empress Augusta Bay', value: '11'},
                        {name:'Chapter 12: Mariana\'s Turmoil Pt.1', value: '12'},
                        {name:'Chapter 13: Mariana\'s Turmoil Pt.2', value: '13'},
                        {name:'Chapter 14: Surigao Night Combat', value: '14'},
                    ]
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'gear',
            description: 'Get information about an Azur Lane gear!',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'gear-name',
                    description: 'Gear Name'
                },
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'exp-calculator',
            description: 'Calculate the EXP needed for the ship to reach the target level.',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'rarity',
                    description: 'Rarity of the ship',
                    choices: [
                        {name: 'Normal', value: 'normal'},
                        {name: 'Ultra Rare', value: 'ultraRare'}
                    ]
                },
                {
                    type: 'INTEGER',
                    required: true,
                    name: 'current-level',
                    description: 'The ship\'s current level (Max 125)'
                },
                {
                    type: 'INTEGER',
                    required: true,
                    name: 'target-level',
                    description: 'The level you want the ship to reach (Max 125)'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'pr-completion-calculator',
            description: 'Calculate your PR completion!',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'ship-name',
                    description: 'Name of the PR/DR ship.'
                },
                {
                    type: 'INTEGER',
                    required: true,
                    name: 'dev-level',
                    description: 'Dev level of the PR/DR ship. (Max 30)'
                },
                {
                    type: 'INTEGER',
                    required: true,
                    name: 'unused-bps',
                    description: 'Number of BPs you have spent on the current dev level + Number of unused BPs.'
                },
                {
                    type: 'STRING',
                    name: 'fate-sim-level',
                    description: 'Fate simulation level of the PR/DR ship.',
                    choices: [
                        {name: '0', value: '0'},
                        {name: '1', value: '1'},
                        {name: '2', value: '2'},
                        {name: '3', value: '3'},
                        {name: '4', value: '4'},
                        {name: '5', value: '5'}
                    ]
                },

            ]
        }
    ],
    run: async({interaction}) => {
        switch (interaction.options.getSubcommand()) {
            case 'ship': {
                // Getting information about the ship
                const shipName: string = interaction.options.getString('ship-name')
                const ship: any = await AL.ships.get(shipName)
                if (ship == undefined) {
                    const shipNotFound: MessageEmbed = new MessageEmbed()
                        .setDescription('Ship not found!')
                        .setColor('RED')
                    return interaction.reply({embeds:[shipNotFound], ephemeral: true})
                }
                

                // Color Picking
                let color: any
                if (ship.rarity === 'Normal') color = '#b0b7b8';
                if (ship.rarity === 'Rare') color = '#03dbfc';
                if (ship.rarity === 'Elite') color = '#ec18f0';
                if (ship.rarity === 'Super Rare' || ship.rarity === 'Priority') color = '#eff233';
                if (ship.rarity === 'Ultra Rare' || ship.rarity === 'Decisive') color = 'BLACK';
               

                // General Info
                await interaction.deferReply()
                const info: MessageEmbed = new MessageEmbed()
                    .setTitle(`${ship.names.en} | ${ship.names.code}`)
                    .setDescription(`[Wiki Link](${ship.wikiUrl})\nDrawn by ${ship.misc.artist.name}\nVoiced by ${ship.misc.voice.name !== undefined ? ship.misc.voice.name : "Unknown"}`)
                    .setThumbnail(ship.thumbnail)
                    .setColor(color)
                    .addFields(
                        {name: 'Rarity:', value: ship.rarity},
                        {name: 'Nationality:', value: `${ship.nationality !== undefined ? ship.nationality : `None`}`},
                        {name: 'Class:', value: ship.class},
                        {name: 'Hull Type:', value: ship.hullType},
                    )
                

                // Checks for PR ship
                if (ship.rarity !== 'Decisive' && ship.rarity !== 'Priority') {
                    const pools: string[] = []
                    if (ship.construction.availableIn.exchange !== false) pools.push('Exchange')
                    if (ship.construction.availableIn.light !== false) pools.push('Light Ship Pool');
                    if (ship.construction.availableIn.heavy !== false) pools.push('Heavy Ship Pool');
                    if (ship.construction.availableIn.aviation !== false) pools.push('Special Ship Pool');
                    if (ship.construction.availableIn.limited !== false) pools.push(`Limited Ship Pool: ${ship.construction.availableIn.limited}`);
                    
                    let aprIn: string;
                    pools.length > 0
                        ? aprIn = pools.join('\n')
                        : aprIn = 'Maps'

                    let maps: string[] = []
                    if (ship.obtainedFrom.fromMaps.length > 0) {
                        for (let i = 0; i < ship.obtainedFrom.fromMaps.length; i++) {
                            if (ship.obtainedFrom.fromMaps[i].name !== undefined) {
                                maps.push(ship.obtainedFrom.fromMaps[i].name)
                            } else {
                                maps.push(ship.obtainedFrom.fromMaps[i])
                            }
                        }   
                    }

                    
                    if (maps.length > 0 && pools.length > 0) {
                        // Pools + Maps ship appears in
                        aprIn = aprIn + `\nMaps: ${maps.join(', ')}`
                    } else if (maps.length > 0 && !(pools.length > 0)) {
                        // Maps only
                        aprIn = aprIn + `: ${maps.join(', ')}`
                    }
                    

                    info
                        .addFields(
                            {name: 'Construction:', value: ship.construction.constructionTime === 'Drop Only' ? 'Cannot be Constructed' : ship.construction.constructionTime },
                            {name: 'Appears In:', value: aprIn},
                            {name: 'Obtainable From:', value: `${ship.obtainedFrom.obtainedFrom !== undefined ? ship.obtainedFrom.obtainedFrom : `Maps`}`}
                        )
                } else {
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
                    limitBreak = `
                    **First**: ${ship.limitBreaks[0].join('/')}
                    **Second**: ${ship.limitBreaks[1].join('/')}
                    **Third**: ${ship.limitBreaks[2].join('/')}`
                } else {
                    name = 'Dev Levels:'
                    limitBreak = `**Dev 5**: ${ship.devLevels[0].buffs.join('/')}
                    **Dev 10**: ${ship.devLevels[1].buffs.join('/')}
                    **Dev 15**: ${ship.devLevels[2].buffs.join('/')}
                    **Dev 20**: ${ship.devLevels[3].buffs.join('/')}
                    **Dev 25**: ${ship.devLevels[4].buffs.join('/')}
                    **Dev 30**: ${ship.devLevels[5].buffs.join('/')}`
                }

                
                const stats: MessageEmbed = new MessageEmbed()
                    .setTitle(`${ship.names.en}'s Stats`)
                    .setColor(color)
                    .setThumbnail(ship.thumbnail)
                    .addFields(
                        {name: name, value: limitBreak},
                        {name: 'Weapon Slots: MinEff%/MaxEff%: ', value: `
                        **${ship.slots[0].type}**: ${ship.slots[0].minEfficiency}%/${ship.slots[0].maxEfficiency}%
                        **${ship.slots[1].type}**: ${ship.slots[1].minEfficiency}%/${ship.slots[1].maxEfficiency}%
                        **${ship.slots[2].type}**: ${ship.slots[2].minEfficiency}%/${ship.slots[2].maxEfficiency}%`},
                    )
                const statsTable = new Table({//13
                    titles: ['LVL', 'HP', 'RLD', 'LCK', 'FP', 'TRP', 'EVA', 'SPD', 'AA', 'AVI', 'OIL', 'ACC', 'ASW'],
                    titleIndexes: [0, 8, 16, 24, 33, 40, 48, 56, 64, 72, 81, 88, 95],
                    columnIndexes: [0, 5, 11, 17, 23, 28, 34, 40, 46, 52, 58, 63, 69],
                    start: '`',
                    end: '`',
                    padEnd: 5
                })


                // Adding Stats
                statsTable.addRow(
                    [
                        '1', 
                        ship.stats.baseStats.health,
                        ship.stats.baseStats.reload,
                        ship.stats.baseStats.luck,
                        ship.stats.baseStats.firepower,
                        ship.stats.baseStats.torpedo,
                        ship.stats.baseStats.evasion,
                        ship.stats.baseStats.speed,
                        ship.stats.baseStats.antiair,
                        ship.stats.baseStats.aviation,
                        ship.stats.baseStats.oilConsumption,
                        ship.stats.baseStats.accuracy,
                        ship.stats.baseStats.antisubmarineWarfare
                    ]
                )
                statsTable.addRow(
                    [
                        '100',
                        ship.stats.level100.health,
                        ship.stats.level100.reload,
                        ship.stats.level100.luck,
                        ship.stats.level100.firepower,
                        ship.stats.level100.torpedo,
                        ship.stats.level100.evasion,
                        ship.stats.level100.speed,
                        ship.stats.level100.antiair,
                        ship.stats.level100.aviation,
                        ship.stats.level100.oilConsumption,
                        ship.stats.level100.accuracy,
                        ship.stats.level100.antisubmarineWarfare
                    ]
                )
                statsTable.addRow(
                    [
                        '120',
                        ship.stats.level120.health,
                        ship.stats.level120.reload,
                        ship.stats.level120.luck,
                        ship.stats.level120.firepower,
                        ship.stats.level120.torpedo,
                        ship.stats.level120.evasion,
                        ship.stats.level120.speed,
                        ship.stats.level120.antiair,
                        ship.stats.level120.aviation,
                        ship.stats.level120.oilConsumption,
                        ship.stats.level120.accuracy,
                        ship.stats.level120.antisubmarineWarfare
                    ]
                )
                statsTable.addRow(
                    [
                        '125',
                        ship.stats.level125.health,
                        ship.stats.level125.reload,
                        ship.stats.level125.luck,
                        ship.stats.level125.firepower,
                        ship.stats.level125.torpedo,
                        ship.stats.level125.evasion,
                        ship.stats.level125.speed,
                        ship.stats.level125.antiair,
                        ship.stats.level125.aviation,
                        ship.stats.level125.oilConsumption,
                        ship.stats.level125.accuracy,
                        ship.stats.level125.antisubmarineWarfare
                    ]
                )
                
                // Normal Stats
                const stats2: MessageEmbed = new MessageEmbed()
                    .setColor(color)
                    .addFields(statsTable.field())
                    .setFooter({text: 'Normal Stats'})
                
                // Retrofit Stats
                const stats3: MessageEmbed = new MessageEmbed()
                    .setColor(color)
                    .setFooter({text: 'Retrofit Stats'})

                if (ship.stats.level100Retrofit) {
                    const statsTableRetro = new Table({//13
                        titles: ['LVL', 'HP', 'RLD', 'LCK', 'FP', 'TRP', 'EVA', 'SPD', 'AA', 'AVI', 'OIL', 'ACC', 'ASW'],
                        titleIndexes: [0, 8, 16, 24, 33, 40, 48, 56, 64, 72, 81, 88, 95],
                        columnIndexes: [0, 5, 11, 17, 23, 28, 34, 40, 46, 52, 58, 63, 69],
                        start: '`',
                        end: '`',
                        padEnd: 5
                    })

                    statsTableRetro.addRow(
                        [
                            '100',
                            ship.stats.level100Retrofit.health,
                            ship.stats.level100Retrofit.reload,
                            ship.stats.level100Retrofit.luck,
                            ship.stats.level100Retrofit.firepower,
                            ship.stats.level100Retrofit.torpedo,
                            ship.stats.level100Retrofit.evasion,
                            ship.stats.level100Retrofit.speed,
                            ship.stats.level100Retrofit.antiair,
                            ship.stats.level100Retrofit.aviation,
                            ship.stats.level100Retrofit.oilConsumption,
                            ship.stats.level100Retrofit.accuracy,
                            ship.stats.level100Retrofit.antisubmarineWarfare
                        ]
                    )

                    statsTableRetro.addRow(
                        [
                            '120',
                            ship.stats.level120Retrofit.health,
                            ship.stats.level120Retrofit.reload,
                            ship.stats.level120Retrofit.luck,
                            ship.stats.level120Retrofit.firepower,
                            ship.stats.level120Retrofit.torpedo,
                            ship.stats.level120Retrofit.evasion,
                            ship.stats.level120Retrofit.speed,
                            ship.stats.level120Retrofit.antiair,
                            ship.stats.level120Retrofit.aviation,
                            ship.stats.level120Retrofit.oilConsumption,
                            ship.stats.level120Retrofit.accuracy,
                            ship.stats.level120Retrofit.antisubmarineWarfare
                        ]
                    )

                    statsTableRetro.addRow(
                        [
                            '125',
                            ship.stats.level125Retrofit.health,
                            ship.stats.level125Retrofit.reload,
                            ship.stats.level125Retrofit.luck,
                            ship.stats.level125Retrofit.firepower,
                            ship.stats.level125Retrofit.torpedo,
                            ship.stats.level125Retrofit.evasion,
                            ship.stats.level125Retrofit.speed,
                            ship.stats.level125Retrofit.antiair,
                            ship.stats.level125Retrofit.aviation,
                            ship.stats.level125Retrofit.oilConsumption,
                            ship.stats.level125Retrofit.accuracy,
                            ship.stats.level125Retrofit.antisubmarineWarfare
                        ]
                    )

                    stats3.addFields(statsTableRetro.field())
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

                if (ship.fleetTech.statsBonus.collection == null || ship.fleetTech.techPoints == null) {
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


                    techPts = `
                    Unlocking The Ship: **${ship.fleetTech.techPoints.collection}**
                    Max Limit Break: **${ship.fleetTech.techPoints.maxLimitBreak}**
                    Reaching Level 120: **${ship.fleetTech.techPoints.maxLevel}**
                    Total Tech Points: **${ship.fleetTech.techPoints.total}**`

                    statsBonus = `
                    Unlocking The Ship: ${ship.fleetTech.statsBonus.collection.bonus} **${collection}** for ${toTitleCase(ship.fleetTech.statsBonus.collection.applicable.join(', '))}s
                    Reaching Level 120: ${ship.fleetTech.statsBonus.maxLevel.bonus} **${maxLevel}** for ${toTitleCase(ship.fleetTech.statsBonus.maxLevel.applicable.join(', '))}s`
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
                const skinEmbed: MessageEmbed[] = []
                let description: string;

                ship.skins.forEach((skin) => {
                    if (skin.info.obtainedFrom === 'Skin Shop') {
                        description = `
                        **Skin Name**: ${skin.name}
                        **Obtain From**: Skin Shop
                        **Cost**: ${skin.info.cost} <:GEAMS:1002198674539036672>     
                        **Live2D?** ${skin.info.live2dModel == false ? 'No' : 'Yes'}
                        **Limited or Permanent**: ${skin.info.enLimited == undefined ? `${skin.info.enClient} on EN.` : skin.info.enLimited}`
                    } else if (skin.info.obtainedFrom === 'Default') {
                        description = `**Skin Name**: ${skin.name}`
                    } else {
                        description = `
                        **Skin Name**: ${skin.name}
                        **Obtain From**: ${skin.info.obtainedFrom}`
                    }

                    skinEmbed.push(
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
                const message = await interaction.editReply({embeds:[info], components: [category]})


                // Collector 
                const collector: InteractionCollector<SelectMenuInteraction> = await (message as Message).createMessageComponentCollector({
                    componentType: 'SELECT_MENU',
                    time: 120000,
                })

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
                        await i.deferUpdate()
                        switch (i.values[0]) {
                            case 'info': {
                                for (let i = 0; i < 5; i++) {
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
                                for (let i = 0; i < 5; i++) {
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
                                for (let i = 0; i < 5; i++) {
                                    i == 2
                                        ? (category.components[0] as MessageSelectMenu).options[i].default = true
                                        : (category.components[0] as MessageSelectMenu).options[i].default = false
                                }

                                const statsEmbed = ship.stats.level100Retrofit ? [stats, stats2, stats3] : [stats, stats2]

                                await i.editReply({
                                    embeds: statsEmbed,
                                    components: [category]
                                })
                                break
                            }

                            case 'skills': {
                                for (let i = 0; i < 5; i++) {
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
                                for (let i = 0; i < 5; i++) {
                                    i == 4
                                        ? (category.components[0] as MessageSelectMenu).options[i].default = true
                                        : (category.components[0] as MessageSelectMenu).options[i].default = false
                                }

                                if (skinEmbed.length === 1) {
                                    await i.editReply({
                                        embeds: [skinEmbed[0]],
                                        components: [category]
                                    })
                                } else {
                                    ShinanoPaginator({
                                        interaction: interaction,
                                        pages: skinEmbed,
                                        interactor_only: true,
                                        timeout: 120000,
                                        menu: category,
                                    })
                                }
                                break
                            }
                        }
                    }

                    collector.resetTimer()
                })
                
                collector.on('end', async (collected, reason) => {
                    (category.components[0] as MessageSelectMenu).setDisabled(true)
                    await interaction.editReply({components:[category]})
                })
                break
            }

            case 'chapter': {
                await interaction.deferReply()
                const chapterNumber: string = interaction.options.getString('chapter-number')
                const chapter = AL.chapters.filter((chapter) => {
                    return chapter.id === chapterNumber
                })
                const info = chapter[0]


                const title = `Chapter ${info.id}: ${info.names.en}`
                // Normal
                const normalLevels: MessageEmbed[] = []
                for (let i = 1; i-1 < 4; i++) {
                    const blueprints: string[] = []

                    info[i].normal.blueprintDrops.forEach((blueprint) => {
                        const name = blueprint.tier + ' ' + blueprint.name
                        blueprints.push(name)
                    })

                    normalLevels.push(
                        new MessageEmbed()
                            .setTitle(`${title} | ${info[i].normal.code}`)
                            .setDescription(`
                                **${info[i].normal.title}**
                                *${info[i].normal.introduction}*`
                            )
                            .addFields(
                                {name: 'Unlock Requirements:', value: `${info[i].normal.unlockRequirements.text}`, inline: false},

                                {name: 'Airspace Control:', value: `
                                Actual: ${info[i].normal.airspaceControl.actual  ? info[i].normal.airspaceControl.actual : 'N/A'}
                                Denial: ${info[i].normal.airspaceControl.denial ? info[i].normal.airspaceControl.denial : 'N/A'}
                                Parity: ${info[i].normal.airspaceControl.parity  ? info[i].normal.airspaceControl.parity : 'N/A'}
                                Superiority: ${info[i].normal.airspaceControl.superiority ? info[i].normal.airspaceControl.superiority : 'N/A'}
                                Supremacy: ${info[i].normal.airspaceControl.supremacy ? info[i].normal.airspaceControl.supremacy : 'N/A'}`, inline: false},
        
                                {name: 'Base XP:', value: `
                                **Small Fleet**: ${info[i].normal.baseXP.smallFleet}
                                **Medium Fleet**: ${info[i].normal.baseXP.mediumFleet}
                                **Large Fleet**: ${info[i].normal.baseXP.largeFleet}
                                **Boss Fleet**: ${info[i].normal.baseXP.bossFleet}`, inline: true},
        
                                {name: 'Enemies Level:', value: `
                                **Mob Level**: ${info[i].normal.enemyLevel.mobLevel}
                                **Boss Level**: ${info[i].normal.enemyLevel.bossLevel}
                                **Boss Ship**: ${info[i].normal.enemyLevel.boss}`, inline: true},
        
                                {name: 'Required Battles:', value: `
                                **Battles Before Boss**: ${info[i].normal.requiredBattles}
                                **Boss Battles For 100%**: ${info[i].normal.bossKillsToClear}`, inline: true},
        
                                {name: 'Drops:', value: info[i].normal.mapDrops.join('\n'), inline: true},
                                {name: 'Blueprints:', value: blueprints.length > 0 ? blueprints.join('\n') : 'None', inline: true}
                            )
                    )
                }


                // Hard
                if (info[1].hard) {
                    const hardLevels: MessageEmbed[] = []
                    const title = `Chapter ${info.id}: ${info.names.en}`

                    for (let i = 1; i-1 < 4; i++) {
                        const blueprints: string[] = []

                        info[i].hard.blueprintDrops.forEach((blueprint) => {
                            let name = blueprint.tier + ' ' + blueprint.name
                            blueprints.push(name)
                        })

                        hardLevels.push(
                            new MessageEmbed()
                                .setTitle(`${title} | ${info[i].hard.code} | Hard`)
                                .setDescription(`
                                    **${info[i].hard.title}**
                                    *${info[i].hard.introduction}*`
                                )
                                .addFields(
                                    {name: 'Unlock Requirements:', value: `${info[i].hard.unlockRequirements.text}`, inline: false},

                                    {name: 'Airspace Control:', value: `
                                    Actual: ${info[i].hard.airspaceControl.actual ? info[i].hard.airspaceControl.actual : 'N/A'}
                                    Denial: ${info[i].hard.airspaceControl.denial ? info[i].hard.airspaceControl.denial : 'N/A'}
                                    Parity: ${info[i].hard.airspaceControl.parity ? info[i].hard.airspaceControl.parity : 'N/A'}
                                    Superiority: ${info[i].hard.airspaceControl.superiority ? info[i].hard.airspaceControl.superiority : 'N/A'}
                                    Supremacy: ${info[i].hard.airspaceControl.supremacy ? info[i].hard.airspaceControl.supremacy : 'N/A'}`, inline: false},    
            
                                    {name: 'Base XP:', value: `
                                    **Small Fleet**: ${info[i].hard.baseXP.smallFleet}
                                    **Medium Fleet**: ${info[i].hard.baseXP.mediumFleet}
                                    **Large Fleet**: ${info[i].hard.baseXP.largeFleet}
                                    **Boss Fleet**: ${info[i].hard.baseXP.bossFleet}`, inline: true},
            
                                    {name: 'Enemies Level:', value: `
                                    **Mob Level**: ${info[i].normal.enemyLevel.mobLevel}
                                    **Boss Level**: ${info[i].hard.enemyLevel.bossLevel}
                                    **Boss Ship**: ${info[i].hard.enemyLevel.boss}`, inline: true},
            
                                    {name: 'Required Battles:', value: `
                                    **Battles Before Boss**: ${info[i].hard.requiredBattles}
                                    **Boss Battles For 100%**: ${info[i].hard.bossKillsToClear}`, inline: true},
            
                                    {name: 'Drops:', value: info[i].hard.mapDrops.join('\n'), inline: true},
                                    {name: 'Blueprints:', value: blueprints.length > 0 ? blueprints.join('\n') : 'None', inline: true}
                                )
                        )
                    }
                    
                    

                    // Selection Menu
                    const navigation = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId(`${chapterNumber}-${interaction.user.id}`)
                                .setMaxValues(1)
                                .setMinValues(1)
                                .addOptions(
                                    {
                                        label: 'Normal',
                                        value: 'normal',
                                        default: true
                                    },
                                    {
                                        label: 'Hard',
                                        value: 'hard',
                                        default: false
                                    }
                                )
                        )
                    


                    // Paginator
                    const message = await interaction.editReply({
                        embeds: [normalLevels[0]],
                        components: [navigation]
                    })

                    ShinanoPaginator({
                        interaction: interaction,
                        interactor_only: true,
                        pages: normalLevels,
                        timeout: 120000,
                        menu: navigation,
                    })



                    // Collector
                    const collector: InteractionCollector<SelectMenuInteraction> = (message as Message).createMessageComponentCollector({
                        componentType: 'SELECT_MENU',
                        time: 60000
                    })

                    collector.on('collect', async (i) => {
                        // Filtering Interaction
                        if (!i.customId.endsWith(i.user.id)) {
                            return i.reply({
                                content: 'This menu is not for you!',
                                ephemeral: true
                            })
                        }

                        await i.deferUpdate()
                        switch (i.values[0]) {
                            case 'normal': {
                                (navigation.components[0] as MessageSelectMenu).options[0].default = true;
                                (navigation.components[0] as MessageSelectMenu).options[1].default = false;

                                ShinanoPaginator({
                                    interaction: interaction,
                                    menu: navigation,
                                    interactor_only: true,
                                    pages: normalLevels,
                                    timeout: 120000,
                                })
                                break                
                            }

                            case 'hard': {
                                (navigation.components[0] as MessageSelectMenu).options[0].default = false;
                                (navigation.components[0] as MessageSelectMenu).options[1].default = true;

                                ShinanoPaginator({
                                    interaction: interaction,
                                    menu: navigation,
                                    interactor_only: true,
                                    pages: hardLevels,
                                    timeout: 120000,
                                })                
                                break
                            }
                        }

                        collector.resetTimer()
                    })
                } else {
                    // Only pages is needed if hard levels don't exist
                    ShinanoPaginator({
                        interaction: interaction,
                        interactor_only: true,
                        pages: normalLevels,
                        timeout: 120000,
                    })    
                }
                break
            }

            case 'gear': {
                await interaction.deferReply()
                
                const gearName: string = interaction.options.getString('gear-name')
                const gearFiltered = AL.equipments.filter((gear) => {
                    if (gear.names['wiki'] && gear.names['wiki'].toLowerCase() === gearName.toLowerCase()) return gear;
                    if (gear.names.en.toLowerCase() === gearName.toLowerCase()) return gear;
                })

                if (gearFiltered.length === 0 || gearFiltered == undefined) {
                    const noResult: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription('Gear not found! Make sure you entered the gear\'s full name or spelt the gear\'s name properly!')
                    return interaction.editReply({embeds:[noResult]})
                }
                const gear: any = gearFiltered[0]


                // Gears
                const infoEmbeds: MessageEmbed[] = []
                const statsEmbeds: MessageEmbed[] = []
                const equippableEmbeds: MessageEmbed[] = []
                for (let i = 1; gear.tiers.length > 1 ? i-1 < gear.tiers.length - 1 : i-1 < gear.tiers.length; i++) {

                    let count = i
                    if (gear.tiers.length === 1) count = i - 1;


                    // Color Picking
                    let color: any;
                    if (gear.tiers[count].rarity === 'Normal') color = '#b0b7b8';
                    if (gear.tiers[count].rarity === 'Rare') color = '#03dbfc';
                    if (gear.tiers[count].rarity === 'Elite') color= '#ec18f0';
                    if (gear.tiers[count].rarity === 'Super Rare') color = '#eff233';
                    if (gear.tiers[count].rarity === 'Ultra Rare') color = 'BLACK';


                    // General Info
                    infoEmbeds.push(
                        new MessageEmbed()
                            .setTitle(`${gear.names['wiki'] !== undefined ? gear.names['wiki'] : gear.names.en} | ${gear.tiers[count].rarity}`)
                            .setDescription(`Stars: ${gear.tiers[count].stars.stars}`)
                            .setColor(color)
                            .setThumbnail(gear.image)
                            .addFields(
                                {name: 'Nationality:', value: gear.nationality},
                                {name: 'Gear Type:', value: `${gear.category} | ${gear.type.name}`},
                                {name: 'Obtain From:', value: gear.misc.obtainedFrom},
                            )
                    )

                    if (gear.misc.notes.length > 0) {
                        infoEmbeds[gear.tiers.length > 1 ? count-1 : count]
                            .addField('Notes:', gear.misc.notes)
                    }
                    

                    // Stats
                    statsEmbeds.push(
                        new MessageEmbed()
                            .setColor(color)
                            .setThumbnail(gear.image)
                            .setTitle(`${gear.names['wiki'] !== undefined ? gear.names['wiki'] : gear.names.en} | ${gear.tiers[count].rarity}`)
                    )

                    for (let stat in gear.tiers[count].stats) {
                        let name: string 
                        let st = gear.tiers[count].stats[stat].formatted // Stats of {name}

                        switch (stat.toLowerCase()) {
                            case 'antiair':
                                name = 'Anti-Air:'
                                break
                            case 'volleytime':
                                name = 'Volley Time:'
                                break
                            case 'rateoffire':
                                name = 'Rate of Fire:'
                                break
                            case 'opsdamageboost':
                                name = 'OPS Damage Boost'
                                break
                            case 'ammotype':
                                name = 'Ammo Type:'
                                break
                            case 'planehealth': 
                                name = 'Plane\'s Health:'
                                break
                            case 'dodgelimit':
                                name = 'Dodge Limit:'
                                break
                            case 'crashdamage':
                                name = 'Crash Damage:'
                                break
                            case 'nooftorpedoes':
                                name = 'Number of Torpedoes:'
                                break
                            case 'aaguns': {
                                let guns: string[] = []

                                gear.tiers[count].stats[stat].stats.forEach((unit) => {
                                    guns.push(unit.formatted)
                                })

                                name = 'AA Guns'
                                st = guns.join('\n')

                                break
                            }
                            case 'ordnance': {
                                let ordnances: string[] = []

                                gear.tiers[count].stats[stat].stats.forEach((unit) => {
                                    ordnances.push(unit.formatted)
                                })

                                name = toTitleCase(stat) + ':'
                                st = ordnances.join('\n')

                                break
                            }
                            default: { 
                                name = toTitleCase(stat) + ':'
                                break
                            }
                        } 

                        statsEmbeds[gear.tiers.length > 1 ? count-1 : count]
                            .addField(name, st)
                    }    


                    // Equippables
                    const fitted: string[] = []
                    for (let ship in gear.fits) {
                        if (gear.fits[ship] !== null) {
                            switch (ship.toLowerCase()) {
                                case 'destroyer':
                                    fitted.push(`Destroyer: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'lightcruiser':
                                    fitted.push(`Light Cruiser: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'heavycruiser':
                                    fitted.push(`Heavy Cruiser: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'monitor':
                                    fitted.push(`Monitor: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'largecruiser':
                                    fitted.push(`Large Cruiser: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'battleship':
                                    fitted.push(`Battleship: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'battlecruiser':
                                    fitted.push(`Battlecruiser: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'aviationbattleship':
                                    fitted.push(`Aviation Battleship: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'lightcarrier':
                                    fitted.push(`Light Carrier: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'aircraftcarrier':
                                    fitted.push(`Aircraft Carrier: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'repairship':
                                    fitted.push(`Repair Ship: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'munitionship':
                                    fitted.push(`Munition Ship: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'submarine':
                                    fitted.push(`Submarine: ${toTitleCase(gear.fits[ship])}`)
                                    break
                                case 'submarinecarrier':
                                    fitted.push(`Submarine Carrier: ${toTitleCase(gear.fits[ship])}`)
                            }
                        }
                    }
                    
                    equippableEmbeds.push(
                        new MessageEmbed()
                            .setColor(color)
                            .setThumbnail(gear.image)
                            .setTitle(`${gear.names['wiki'] !== undefined ? gear.names['wiki'] : gear.names.en}`)
                            .addField('Equippable By:', fitted.join('\n'))
                    )
                }

                // Selection Menu
                const navigationTiers = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                        .setCustomId(`TIERS-${interaction.user.id}`)
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(false)
                        .addOptions(
                            {
                                label: 'Tier 1',
                                value: 'T1',
                                default: true
                            },
                            {
                                label: 'Tier 2',
                                value: 'T2',
                                default: false
                            },
                            {
                                label: 'Tier 3',
                                value: 'T3',
                                default: false
                            },
                        )    
                    )
                const navigationOptions = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                        .setCustomId(`op-${interaction.user.id}`)
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(false)
                        .addOptions(
                            {
                                label: 'Info',
                                value: 'info',
                                default: true
                            },
                            {
                                label: 'Stats',
                                value: 'stats',
                                default: false
                            },
                            {
                                label: 'Fits',
                                value: 'fits',
                                default: false
                            }
                        )    
                    )

                // Collector
                let message;
                if (gear.tiers.length > 1) {
                    message = await interaction.editReply({
                        embeds: [infoEmbeds[0]],
                        components: [navigationTiers, navigationOptions]
                    })
                } else {
                    message = await interaction.editReply({
                        embeds: [infoEmbeds[0]],
                        components: [navigationOptions]
                    })
                }

                const collector: InteractionCollector<SelectMenuInteraction> = message.createMessageComponentCollector({
                    componentType: 'SELECT_MENU',
                    time: 120000
                })

                let tierCount: number  = 0
                collector.on('collect', async (i) => {
                    const customId = i.customId.split('-')[0]
                    
                    if (!i.customId.endsWith(i.user.id)) {
                        return i.reply({
                            content: 'This menu is not for you!',
                            ephemeral: true
                        })
                    }

                    await i.deferUpdate()
                    if (customId === 'TIERS') {
                        switch (i.values[0]) {
                            case 'T1': {
                                tierCount = 0

                                for (let i = 0; i < 3; i++) {
                                    if (i !== 0) {
                                        (navigationTiers.components[0] as MessageSelectMenu).options[i].default = false;
                                        (navigationOptions.components[0] as MessageSelectMenu).options[i].default = false; 
                                    } else {
                                        (navigationTiers.components[0] as MessageSelectMenu).options[i].default = true;
                                        (navigationOptions.components[0] as MessageSelectMenu).options[i].default = false;    
                                    }
                                }
                                (navigationOptions.components[0] as MessageSelectMenu).options[0].default = true

                                await i.editReply({
                                    embeds: [infoEmbeds[0]],
                                    components: [navigationTiers, navigationOptions]
                                })

                                break
                            }

                            case 'T2': {
                                tierCount = 1

                                for (let i = 0; i < 3; i++) {
                                    if (i !== 1) {
                                        (navigationTiers.components[0] as MessageSelectMenu).options[i].default = false;
                                        (navigationOptions.components[0] as MessageSelectMenu).options[i].default = false;    
                                    } else {
                                        (navigationTiers.components[0] as MessageSelectMenu).options[i].default = true;
                                        (navigationOptions.components[0] as MessageSelectMenu).options[i].default = false;    
                                    }
                                }
                                (navigationOptions.components[0] as MessageSelectMenu).options[0].default = true

                                await i.editReply({
                                    embeds: [infoEmbeds[1]],
                                    components: [navigationTiers, navigationOptions]
                                })

                                break
                            }

                            case 'T3': {
                                tierCount = 2

                                for (let i = 0; i < 3; i++) {
                                    if (i !== 2) {
                                        (navigationTiers.components[0] as MessageSelectMenu).options[i].default = false;
                                        (navigationOptions.components[0] as MessageSelectMenu).options[i].default = false;    
                                    } else {
                                        (navigationTiers.components[0] as MessageSelectMenu).options[i].default = true;
                                        (navigationOptions.components[0] as MessageSelectMenu).options[i].default = false;
                                    }
                                }
                                (navigationOptions.components[0] as MessageSelectMenu).options[0].default = true;

                                await i.editReply({
                                    embeds: [infoEmbeds[2]],
                                    components: [navigationTiers, navigationOptions]
                                })

                                break
                            }
                        }
                    } else {
                        switch (i.values[0]) {
                            case 'info': {
                                for (let i = 0; i < 3; i++) {
                                    i == 0
                                        ? (navigationOptions.components[0] as MessageSelectMenu).options[i].default = true
                                        : (navigationOptions.components[0] as MessageSelectMenu).options[i].default = false
                                }

                                await i.editReply({
                                    embeds: [infoEmbeds[tierCount]],
                                    components: gear.tiers.length > 1 ? [navigationTiers, navigationOptions] : [navigationOptions]
                                })

                                break
                            }

                            case 'stats': {
                                for (let i = 0; i < 3; i++) {
                                    i == 1
                                        ? (navigationOptions.components[0] as MessageSelectMenu).options[i].default = true
                                        : (navigationOptions.components[0] as MessageSelectMenu).options[i].default = false
                                }

                                await i.editReply({
                                    embeds: [statsEmbeds[tierCount]],
                                    components: gear.tiers.length > 1 ? [navigationTiers, navigationOptions] : [navigationOptions]
                                })

                                break
                            }

                            case 'fits': {
                                for (let i = 0; i < 3; i++) {
                                    i == 2
                                        ? (navigationOptions.components[0] as MessageSelectMenu).options[i].default = true
                                        : (navigationOptions.components[0] as MessageSelectMenu).options[i].default = false
                                }

                                await i.editReply({
                                    embeds: [equippableEmbeds[tierCount]],
                                    components: gear.tiers.length > 1 ? [navigationTiers, navigationOptions] : [navigationOptions]
                                })

                                break
                            }
                        } 
                    }

                    collector.resetTimer()
                })

                collector.on('end', async (collected, reason) => {
                    (navigationTiers.components[0] as MessageSelectMenu).setDisabled(true);
                    (navigationOptions.components[0] as MessageSelectMenu).setDisabled(true);

                    await interaction.editReply({
                        components: gear.tiers.length > 1 ? [navigationTiers, navigationOptions] : [navigationOptions]
                    })
                })
                break
            }

            case 'exp-calculator': {
                await interaction.deferReply()

                const currentLevel = interaction.options.getInteger('current-level')
                const targetLevel = interaction.options.getInteger('target-level')
                const rarity = interaction.options.getString('rarity')
                

                if (currentLevel > 125 || targetLevel > 125) {
                    const overboard: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription('Level cannot go pass 125!')
                    return interaction.editReply({embeds: [overboard]})
                }

                const expNeeded: MessageEmbed = new MessageEmbed()
                    .setTitle('Experience Calculator')
                    .setColor('BLUE')
                

                // 0 LEVEL DIFFERENCE
                if (currentLevel == targetLevel) {
                    expNeeded
                        .setDescription(`You will need **0 EXP** to get ${rarity === 'normal' ? 'a Normal ship' : 'an Ultra Rare ship'} from LV${currentLevel} to LV${targetLevel}`)
                    return interaction.editReply({embeds: [expNeeded]})
                }

                if (currentLevel == 0 || targetLevel == 0) {
                    const tooLow: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`${currentLevel == 0 ? "Ship\'s current level" : "Target level"} must be bigger than 0!`)
                    return interaction.editReply({embeds: [tooLow]})
                }


                // EXP Calculation
                const response = await fetch('https://amagi-api-back.herokuapp.com/azur-lane/ship-stats', {
                    method: "GET",
                    headers: {
                        'apiKey': process.env['lewdApiKey']
                    }
                })
                const data = (await response.json()).body



                let table: number[]
                rarity === 'normal'
                    ? table = data.normal
                    : table = data.ultraRare
                const expDifference = (table[targetLevel - 1]) - (table[currentLevel - 1])


                expNeeded
                    .setDescription(`You will need **${expDifference.toLocaleString()} EXP** to get ${rarity === 'normal' ? 'a Normal ship' : 'an Ultra Rare ship'} from level **${currentLevel}** to level **${targetLevel}**`)
                return interaction.editReply({embeds: [expNeeded]})
            }

            case 'pr-completion-calculator': {
                /*
                    Helpful comments stop here, I don't know what I did but it sure as hell did work out perfectly fine 💀
                */

                // Receiving and processing data
                const shipName: string = interaction.options.getString('ship-name').toLowerCase()
                let devLevel: number = interaction.options.getInteger('dev-level')
                const unusedBPs: number = interaction.options.getInteger('unused-bps')
                let fateSimLevel: number
                let totalPRBPs: number
                let prTable: number[]
                let prFSTable: number[]
                let prFSTableTotal: number[]
                let color: any

                const response = await fetch('https://amagi-api-back.herokuapp.com/azur-lane/ship-stats', {
                    method: "GET",
                    headers: {
                        'apiKey': process.env['lewdApiKey']
                    }
                })
                const data = (await response.json()).body

                if (interaction.options.getString('fate-sim-level') == null) {
                    fateSimLevel = 0
                } else {
                    fateSimLevel = parseInt(interaction.options.getString('fate-sim-level'), 10)
                    devLevel = 30
                }

                const ship: any = await AL.ships.get(shipName)
                if (!ship) {
                    const shipNotFound: MessageEmbed = new MessageEmbed()
                        .setDescription('Ship not found!')
                        .setColor('RED')
                    return interaction.reply({embeds:[shipNotFound], ephemeral: true})
                }

                if (ship.rarity !== 'Priority' && ship.rarity !== 'Decisive') {
                    const shipNotPR: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription('The ship is not a PR ship!')
                    return interaction.reply({embeds: [shipNotPR]})
                }

                if (ship.rarity === 'Priority') {
                    color = 'GOLD'
                    prTable = data.PR
                    prFSTable = data["PR-FS"]
                    prFSTableTotal = data["PR-FS-TOTAL"]
                    totalPRBPs = prTable[30] + prFSTable[5]
                } else {
                    color = 'BLACK'
                    prTable = data.DR
                    prFSTable = data["DR-FS"]
                    prFSTableTotal = data["DR-FS-TOTAL"]
                    totalPRBPs = prTable[30] + prFSTable[5]
                }
                

                if (unusedBPs < 0 || devLevel < 0 || fateSimLevel < 0 || ((unusedBPs > totalPRBPs) && (devLevel > 0)) || devLevel > 30) {
                    const impossible: MessageEmbed = new MessageEmbed()
                        .setDescription('Your inputted data is wrong, please check again')
                        .setColor('RED')
                    return interaction.reply({embeds: [impossible]})
                }


                // MATH
                await interaction.deferReply()
                function closest(num: number, array: number[]) {
                    let curr = array[0]
                    for (let i = 0; i < array.length; i++) {
                        if (Math.abs(num - array[i]) < Math.abs(num - curr)) {
                            curr = array[i]
                        }
                    }
                    return array.indexOf(curr)
                }

                const totalBPs: number = fateSimLevel > 0 ? prTable[30] + prFSTable[fateSimLevel] + unusedBPs : prTable[devLevel] + unusedBPs
                const BPsAwayFromDev30: number = prTable[30] - totalBPs < 0 ? 0 : prTable[30] - totalBPs
                const BPsAwayFromFS5: number = (prTable[30] + prFSTable[5]) - totalBPs
                const PRcompletionPercentage: number = fateSimLevel > 0 ? 100 : (totalBPs / prTable[30]) * 100
                const PRcompletionPercentageFS: number = (totalBPs / (prTable[30] + prFSTable[5])) * 100
                const finalDevLevel: number = closest(totalBPs, prTable)
                const finalFSLevel: number = closest(totalBPs, prFSTableTotal)
                

                const completion: MessageEmbed = new MessageEmbed()
                    .setColor(color)
                    .setTitle(`PR Completion | ${ship.rarity} | ${ship.names.en}`)
                    .setThumbnail(ship.thumbnail)
                    .addFields(
                        {name: 'Ship Info:', value: `
                        Unused BPs: **${unusedBPs}**
                        Dev Level: **${devLevel}**
                        Fate Sim Level: **${fateSimLevel}**`},

                        {name: 'Current PR Progress:', value: `
                        Total BPs: **${totalBPs}**
                        BPs until Dev 30: **${BPsAwayFromDev30}**
                        BPs until Fate Sim 5: **${BPsAwayFromFS5}**
                        Final Dev Level: **${finalDevLevel}**
                        Final Fate Sim Level: **${finalFSLevel}**
                        PR Completion: **${PRcompletionPercentage.toFixed(2)}%**
                        PR Completion (with Fate Sim): **${PRcompletionPercentageFS.toFixed(2)}%**`}
                    )
                    .setFooter({text: 'Fate Sim is included regardless even if the ship does not have Fate Sim in game.'})
                await interaction.editReply({embeds: [completion]})
                break
            }       
        }
    }
})
