import { ShinanoInteraction } from "../../../../typings/Command";
import genshin from 'genshin-db'
import { InteractionCollector, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { Element } from "../../../../typings/Genshin";


const stars = (item: genshin.Character | genshin.Weapon) => {return "⭐".repeat(parseInt(item.rarity, 10))}
const color = (char: genshin.Character, elementColors: Element) => {return elementColors[char.element]}
const icon = (char: genshin.Character, elementIcons: Element) => {return elementIcons[char.element]}


export async function genshinCharacterInfo(interaction: ShinanoInteraction, elementColors: Element, elementIcons: Element) {
    // Fetching info
    const name: string = interaction.options.getString('character-name').toLowerCase()
    const character: genshin.Character = await genshin.characters(name)
    
    if (!character) {
        const noResult: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('❌ | No character found')
        await interaction.editReply({embeds: [noResult]})
    }


    // MC Checking
    let MC: boolean = false
    let embedColor = color(character, elementColors)
    if (character.name === 'Aether' || character.name === 'Lumine') {
        MC = true
        embedColor = 'GREY'
    }


    // General Info
    const infoEmbed: MessageEmbed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle(`${character.name} | ${MC == true ? 'Main Character' : character.title}`)
        .setDescription(`"${character.description}"\n\n${character.url ? `[Wiki Link](${character.url.fandom})` : ""}`)
        .setThumbnail(character.images.icon)
        .addFields(
            {name: 'Element:', value: MC == true ? 'All' : icon(character, elementIcons)},
            {name: 'Rarity:', value: stars(character)},
            {name: 'Weapon Type:', value: character.weapontype},
            {name: 'Constellation', value: character.constellation},
            {name: 'Birthday:', value: MC == true ? 'Player\'s Birthday' : character.birthday},
            {name: 'Region | Affiliation', value: MC == true ? '? | Many' : `${character.region} | ${character.affiliation}`},
            {name:"VAs:", value:`CN: ${character.cv.chinese}\nJP: ${character.cv.japanese}\nKR: ${character.cv.korean}\nEN: ${character.cv.english}`}
        )
        .setFooter({text: `Added in Version ${character.version}`})
    
    
    // Constellation
    const characterCons = genshin.constellations(character.name)

    const consInfo = []
    for (let cons in characterCons) {
        if (cons !== 'name' && cons !== 'images' && cons !== 'version') {
            consInfo.push({
                name: cons.toUpperCase() + ' | ' + characterCons[cons].name,
                description: characterCons[cons].effect
            })
        }
    }


    const consEmbed: MessageEmbed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle(`${character.name}'s Constellations`)
        .setThumbnail(character.images.icon)
    consInfo.forEach((cons) => {
        consEmbed
            .addField(cons.name, cons.description)
    })
    


    // Menu
    const navigation: MessageActionRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setMinValues(1)
                .setMaxValues(1)
                .setCustomId(`${character.name}-${interaction.user.id}`)
                .setDisabled(false)
                .addOptions(
                    {
                        label: 'Info',
                        value: 'info',
                        emoji: '📝',
                        default: true
                    },
                    {
                        label: 'Constellations',
                        value: 'constellations',
                        emoji: '⭐',
                        default: false
                    },
                )
        )
    

    // Collector
    const message = await interaction.editReply({embeds: [infoEmbed], components: [navigation]})
    const collector: InteractionCollector<SelectMenuInteraction> = await (message as Message).createMessageComponentCollector({
        componentType: 'SELECT_MENU',
        time: 120000
    })    

    collector.on('collect', async (i) => {
        if (!i.customId.endsWith(interaction.user.id)) {
            return i.reply({
                content: 'This menu is not for you!',
                ephemeral: true
            })
        }
        

        await i.deferUpdate()
        const selectMenu = navigation.components[0] as MessageSelectMenu

        switch (i.values[0]) {
            case 'info': {
                selectMenu.options[0].default = true
                selectMenu.options[1].default = false

                await interaction.editReply({embeds: [infoEmbed], components: [navigation]})
                break
            }

            case 'constellations': {
                selectMenu.options[0].default = false
                selectMenu.options[1].default = true

                await interaction.editReply({embeds: [consEmbed], components: [navigation]})
                break
            }
        }

        collector.resetTimer()
    })

    collector.on('end', async (collected, reason) => {
        navigation.components[0].setDisabled(true)
        await interaction.editReply({components: [navigation]})
    })
}