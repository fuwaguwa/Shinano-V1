import { MessageEmbed, MessageActionRow, MessageSelectMenu, InteractionCollector, SelectMenuInteraction } from "discord.js";
import { gearStats, gearFits } from "../../../structures/AL";
import { ShinanoInteraction } from "../../../typings/Command";

export async function azurLaneGear(interaction: ShinanoInteraction, AL: any) {
    await interaction.deferReply()
                
    const gearName: string = interaction.options.getString('gear-name')
    const gearFiltered = AL.equipments.filter((gear) => {
        if (gear.names['wiki'] && gear.names['wiki'].toLowerCase() === gearName.toLowerCase()) return gear;
        if (gear.names.en.toLowerCase() === gearName.toLowerCase()) return gear;
    })

    if (gearFiltered.length === 0 || !gearFiltered) {
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


    // Skipping the 0th index for gears with 1+ tiers
    let startingIndex;
    gear.tiers.length != 1 ? startingIndex = 1 : startingIndex = 0;                

    
    for (let i = startingIndex; i < gear.tiers.length; i++) {
        // Color Picking
        let color: any;
        if (gear.tiers[i].rarity === 'Normal') color = '#b0b7b8';
        if (gear.tiers[i].rarity === 'Rare') color = '#03dbfc';
        if (gear.tiers[i].rarity === 'Elite') color = '#ec18f0';
        if (gear.tiers[i].rarity === 'Super Rare') color = '#eff233';
        if (gear.tiers[i].rarity === 'Ultra Rare') color = 'BLACK';


        // Changing array index according for gears with 1+ tiers
        let arrayIndex;
        gear.tiers.length != 1 ? arrayIndex = i-1 : arrayIndex = i


        // General Info
        infoEmbeds.push(
            new MessageEmbed()
                .setTitle(`${gear.names['wiki'] ? gear.names['wiki'] : gear.names.en} | ${gear.tiers[i].rarity}`)
                .setDescription(`Stars: ${gear.tiers[i].stars.stars}`)
                .setColor(color)
                .setThumbnail(gear.image)
                .addFields(
                    {name: 'Nationality:', value: gear.nationality},
                    {name: 'Gear Type:', value: `${gear.category} | ${gear.type.name}`},
                    {name: 'Obtain From:', value: gear.misc.obtainedFrom},
                )
        )

        if (gear.misc.notes.length > 0) {
            infoEmbeds[arrayIndex]
                .addField('Notes:', gear.misc.notes)
        }
        

        // Stats
        statsEmbeds.push(
            new MessageEmbed()
                .setColor(color)
                .setThumbnail(gear.image)
                .setTitle(`${gear.names['wiki'] ? gear.names['wiki'] : gear.names.en} | ${gear.tiers[i].rarity}`)
        )

        gearStats(gear.tiers[i].stats, statsEmbeds[arrayIndex])


        // Equippables
        equippableEmbeds.push(
            new MessageEmbed()
                .setColor(color)
                .setThumbnail(gear.image)
                .setTitle(`${gear.names['wiki'] ? gear.names['wiki'] : gear.names.en}`)
                .addField('Equippable By:', gearFits(gear.fits).join('\n'))
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
                    emoji: '1️⃣',
                    value: 'T1',
                    default: true
                },
                {
                    label: 'Tier 2',
                    value: 'T2',
                    emoji: '2️⃣',
                    default: false
                },
                {
                    label: 'Tier 3',
                    value: 'T3',
                    emoji: '3️⃣',
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
                    emoji: '🔎',
                    default: true
                },
                {
                    label: 'Stats',
                    value: 'stats',
                    emoji: '📝',
                    default: false
                },
                {
                    label: 'Fits',
                    value: 'fits',
                    emoji: '🚢',
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

                    // Resetting the selection
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
}