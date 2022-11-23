import { InteractionCollector, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js"
import { ShinanoInteraction } from "../typings/Command"
import { ShinanoPaginator } from "./Pages"
import { toTitleCase } from "./Utils"

function fileType(type: string) {
    switch (type) {
        case 'j': return 'jpg'
        case 'p': return 'png'
        case 'g': return 'gif'
    }
}

function pageLink(doujin, pageNumber) {
    const type = fileType(doujin.images.pages[pageNumber].t)
    return `https://i.nhentai.net/galleries/${doujin.media_id}/${pageNumber + 1}.${type}`
}

function genDoujinPage(doujin, title) {
    const doujinPages: MessageEmbed[] = []
    for (let i = 0; i < doujin.num_pages; i++) {
        doujinPages.push(
            new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`**[${title} | ${doujin.id}](https://nhentai.net/g/${doujin.id}/${i})**`)
                .setImage(pageLink(doujin, i))
        )   
    }
    return doujinPages
}

export async function displayDoujin(interaction: ShinanoInteraction, doujin) {
    // Processing
    const doujinTitle = doujin.title.pretty || doujin.title.english || doujin.title.japanese
    const doujinThumbnail = pageLink(doujin, 0)

    const doujinTags: string[] = []
    const doujinArtists: string[] = []
    const doujinParodies: string[] = []
    const doujinChars: string[] = []
    const doujinLang: string[] = []
    const doujinCategories: string[] = []
    const doujinGroups: string[] = []

    doujin.tags.forEach(tag => {
        let tagName = toTitleCase(tag.name)
        switch (tag.type) {
            case 'tag': doujinTags.push(tagName); break;
            case 'artist': doujinArtists.push(tagName); break;
            case 'parody': doujinParodies.push(tagName); break;
            case 'character': doujinChars.push(tagName); break;
            case 'language': doujinLang.push(tagName); break;
            case 'category': doujinCategories.push(tagName); break;
            case 'group': doujinGroups.push(tagName); break;
        }
    })

    // Filter
    const filter = doujinTags.find(tag => {
        return tag.includes('Lolicon') || 
        tag.includes('Guro') ||
        tag.includes('Scat') ||
        tag.includes('Insect') || 
        tag.includes('Shotacon') ||
        tag.includes('Amputee') ||
        tag.includes('Vomit')
    })

    if (filter) {
        const blacklisted: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription(
                `❌ | Shinano found that the doujin contains a blacklisted tag (${filter.toLowerCase()}) and will not be displaying it here!\n`
            )
        return interaction.editReply({embeds: [blacklisted]})
    }


    // Components
    let doujinPages: MessageEmbed[]
    if (doujin.num_pages <= 100) doujinPages = genDoujinPage(doujin, doujinTitle)
    
    const mainInfo: MessageEmbed = new MessageEmbed()
        .setTitle(`${doujinTitle} | ${doujin.id}`)
        .setThumbnail(doujinThumbnail)
        .setColor('#2f3136')
        .setDescription(
            `**Tags:**\n` +
            doujinTags.join(", ")
        )
    if (doujinChars.length != 0) mainInfo.addField('Characters:', doujinChars.join(', '), false)
    if (doujinParodies.length != 0) mainInfo.addField('Parodies:', doujinParodies.join(', '), false)
    if (doujinLang.length != 0) mainInfo.addField('Languages:', doujinLang.join(', '), false)
    if (doujinCategories.length != 0) mainInfo.addField('Categories:', doujinCategories.join(', '), false)
    if (doujinArtists.length != 0) mainInfo.addField('Artists:', doujinArtists.join(', '), false)
    if (doujinGroups.length != 0) mainInfo.addField('Groups:', doujinGroups.join(', '), false)
    mainInfo.addFields(
        {name: 'Pages:', value: `${doujin.num_pages}`, inline: true},
        {name: 'Favorites:', value: `${doujin.num_favorites}`, inline: true},
        {name: 'Upload Date:', value: `<t:${doujin.upload_date}:D>`, inline: true}
    )

    
    const navigation: MessageActionRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setMaxValues(1)
                .setMinValues(1)
                .setCustomId(`${doujin.id}-${interaction.user.id}`)
                .addOptions(
                    {
                        label: 'Info',
                        value: 'info',
                        emoji: '🔍',
                        default: true
                    },
                    {
                        label: 'Read',
                        value: 'read',
                        emoji: '📰',
                        default: false
                    }
                )
        )

    
    // Collector
    const message = await interaction.editReply({embeds: [mainInfo], components: [navigation]})
    const collector: InteractionCollector<SelectMenuInteraction> = await (message as Message).createMessageComponentCollector({
        componentType: 'SELECT_MENU',
        time: 120000
    })

    collector.on('collect', async (i) => {
        if (!i.customId.endsWith(`${i.user.id}`)) {
            return i.reply({
                content: 'This menu is not for you!',
                ephemeral: true
            })
        }

        await i.deferUpdate()

        const menu = navigation.components[0] as MessageSelectMenu
        switch (i.values[0]) {
            case 'info': {
                menu.options[0].default = true
                menu.options[1].default = false

                await interaction.editReply({embeds: [mainInfo], components: [navigation]})
                break
            }

            case 'read': {
                menu.options[0].default = false
                menu.options[1].default = true

                if (doujinPages) {
                    ShinanoPaginator({
                        interaction: interaction,
                        interactorOnly: true,
                        pages: doujinPages,
                        menu: navigation,
                        timeout: 120000 
                    })
                } else {
                    const notAvailable: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription(
                            'Unfortunately, we only support doujins that are under 100 pages long. Instead, you can read this doujin ' +
                            `[here](https://nhentai.net/g/${doujin.id})`
                        )
                    await interaction.editReply({embeds: [notAvailable], components: [navigation]})
                }
            }
        }
    })

    collector.on('end', async (collected, reason) => {
        (navigation.components[0] as MessageSelectMenu).setDisabled(true)
        await interaction.editReply({components:[navigation]})
    })
}
