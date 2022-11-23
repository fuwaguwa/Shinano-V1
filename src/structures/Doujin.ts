import { InteractionCollector, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js"
import { ShinanoInteraction } from "../typings/Command"
import { ShinanoPaginator } from "./Pages"
import { toTitleCase } from "./Utils"

function getFileType(type: string) {
    switch (type) {
        case 'j': return 'jpg'
        case 'p': return 'png'
        case 'g': return 'gif'
    }
}

function getPageLink(doujin, pageNumber) {
    const type = getFileType(doujin.images.pages[pageNumber].t)
    return `https://i.nhentai.net/galleries/${doujin.media_id}/${pageNumber + 1}.${type}`
}

function genDoujinPage(doujin, title) {
    const doujinPages: MessageEmbed[] = []
    for (let i = 0; i < doujin.num_pages; i++) {
        doujinPages.push(
            new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`**[${title} | ${doujin.id}](https://nhentai.net/g/${doujin.id}/${i})**`)
                .setImage(getPageLink(doujin, i))
        )   
    }
    return doujinPages
}

export function getDoujinTags(doujin) {
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

    return {
        tags: doujinTags,
        artists: doujinArtists,
        parodies: doujinParodies,
        characters: doujinChars,
        languages: doujinLang,
        categories: doujinCategories,
        groups: doujinGroups
    }
}

export function genDoujinEmbed(doujin, tagInfo) {
    const doujinTitle = doujin.title.pretty || doujin.title.english || doujin.title.japanese
    const doujinThumbnail = getPageLink(doujin, 0)


    const mainInfo: MessageEmbed = new MessageEmbed()
        .setTitle(`${doujinTitle} | ${doujin.id}`)
        .setThumbnail(doujinThumbnail)
        .setColor('#2f3136')
        .setDescription(
            `**Tags:**\n` +
            tagInfo.tags.join(", ")
        )
        .setURL(`https://nhentai.net/g/${doujin.id}`)
    if (tagInfo.characters.length != 0) mainInfo.addField('Characters:', tagInfo.characters.join(', '), false)
    if (tagInfo.parodies.length != 0) mainInfo.addField('Parodies:', tagInfo.parodies.join(', '), false)
    if (tagInfo.languages.length != 0) mainInfo.addField('Languages:', tagInfo.languages.join(', '), false)
    if (tagInfo.categories.length != 0) mainInfo.addField('Categories:', tagInfo.categories.join(', '), false)
    if (tagInfo.artists.length != 0) mainInfo.addField('Artists:', tagInfo.artists.join(', '), false)
    if (tagInfo.groups.length != 0) mainInfo.addField('Groups:', tagInfo.groups.join(', '), false)
    mainInfo.addFields(
        {name: 'Pages:', value: `${doujin.num_pages}`, inline: true},
        {name: 'Favorites:', value: `${doujin.num_favorites}`, inline: true},
        {name: 'Upload Date:', value: `<t:${doujin.upload_date}:D>`, inline: true}
    )

    return mainInfo
}

export async function displayDoujin(interaction: ShinanoInteraction, doujin) {
    // Processing
    const doujinTitle = doujin.title.pretty || doujin.title.english || doujin.title.japanese
    const tagInfo = getDoujinTags(doujin)


    // Filter
    const filter = tagInfo.tags.find(tag => {
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
                `❌ | Shinano found that the doujin contains a blacklisted tag (\`${filter.toLowerCase()}\`) and will not be displaying it here!\n`
            )
        return interaction.editReply({embeds: [blacklisted]})
    }


    // Components
    const mainInfo: MessageEmbed = genDoujinEmbed(doujin, tagInfo)
    let doujinPages: MessageEmbed[]
    if (doujin.num_pages <= 100) doujinPages = genDoujinPage(doujin, doujinTitle)
    
    
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
    const collector = await (message as Message).createMessageComponentCollector({
        time: 150000
    })

    collector.on('collect', async (i) => {
        if (!i.customId.endsWith(`${i.user.id}`)) {
            return i.reply({
                content: 'This menu is not for you!',
                ephemeral: true
            })
        }


        const menu = navigation.components[0] as MessageSelectMenu
        if (i['values']) {
            await i.deferUpdate()
            switch (i['values'][0]) {
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
                            timeout: 150000 
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
        }

        collector.resetTimer()
    })

    collector.on('end', async (collected, reason) => {
        (navigation.components[0] as MessageSelectMenu).setDisabled(true)
        await interaction.editReply({components:[navigation]})
    })
}
