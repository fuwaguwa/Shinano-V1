import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { config } from "dotenv";
import { isNum } from '../../structures/Utils'
import { InteractionCollector, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { ShinanoPaginator } from "../../structures/Pages";
config();

function animeInfo({anime, interaction}) {
    // Genres/Studios
    let genres: string[] = []; anime.genres.forEach(genre => genres.push(genre.name))
    let studios: string[] = []; anime.studios.forEach(studio => studios.push(`[${studio.name}](${studio.url})`))
    

    // Airing Time
    const startDate = Math.floor((new Date(anime.aired.from)).getTime() / 1000)
    const endDate = Math.floor((new Date(anime.aired.to)).getTime() / 1000)


    // Embeds
    const synopsisEmbed: MessageEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setThumbnail(anime.images.jpg.large_image_url)
        .setTitle(`${anime.title} | Synopsis`)
        .setDescription(`*${anime.synopsis || 'No Sypnosis Can Be Found'}*`)
    const generalInfoEmbed: MessageEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setThumbnail(anime.images.jpg.large_image_url)
        .setTitle(`${anime.title} | General Info`)
        .addFields(
            {
                name: 'MyAnimeList Info:',
                value: 
                `**ID**: [${anime.mal_id}](${anime.url})\n` +
                `**Rating**: ${anime.score} ⭐\n` +
                `**Ranking**: #${anime.rank}\n` +
                `**Favorites**: ${anime.favorites}\n` +
                `**Popularity**: #${anime.popularity}\n` 
            },
            {
                name: 'Anime Info:',
                value: 
                `**Rating**: ${anime.rating}\n` +
                `**Genres**: ${genres.join(', ')}\n` + 
                `**JP Title**: ${anime.title_japanese ? anime.title_japanese : 'None'}\n` +
                `**Trailer**: ${anime.trailer.url ? `[Trailer Link](${anime.trailer.url})` : "None"}\n` +
                `**Studio**: ${studios.join(', ')}\n`
            },
            {
                name: 'Episodes Info:', 
                value: 
                `**Status**: ${anime.status}\n` +
                `**Episodes**: ${anime.episodes}\n` +
                `**Duration**: ${anime.duration}\n` +
                `**Start Date**: <t:${startDate}>\n` +
                `**End Date**: <t:${endDate == 0 ? startDate : endDate}>\n`
            }
        )
    
    // Paging
    ShinanoPaginator({
        interaction: interaction,
        interactor_only: true,
        timeout: 120000,
        pages: [synopsisEmbed, generalInfoEmbed]
    })
}

export default new Command({
    name: 'anime',
    description: 'anime',
    cooldown: 4500,
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'search',
            description: 'Search up information of an anime on MyAnimeList',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'name',
                    description: 'The anime\'s name.'
                },
                {
                    type: 'STRING',
                    required: true,
                    name: 'type',
                    description: 'The type of the anime',
                    choices: [
                        {name: 'TV', value: 'tv'},
                        {name: 'Movie', value: 'movie'},
                        {name: 'OVA (Original Video Animation)', value: 'ova'},
                        {name: 'ONA (Original Net Animation)', value: 'ona'}
                    ]
                }
           ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'character',
            description: 'Search up information of an anime character on MyAnimeList',
            options: [
                {
                    type: 'STRING',
                    required: true, 
                    name: 'name',
                    description: 'The character name.'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'random',
            description: 'Return a random anime.'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()
        switch (interaction.options.getSubcommand()) {
            case 'search': {
                const animeName: string = interaction.options.getString('name').toLowerCase()
                const animeType: string = interaction.options.getString('type')

                const query = `q=${animeName}&limit=10&order_by=popularity&type=${animeType}&sfw=true`
                const response = await fetch(`https://api.jikan.moe/v4/anime?${query}`, {method: "GET"})


                // Filtering
                const animeResponse = (await response.json()).data
                if (animeResponse.length == 0) {
                    const noResult: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription('No result can be found!')
                    return interaction.editReply({embeds: [noResult]})
                }

                const resultNavigation: MessageActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId(`RES-${interaction.user.id}`)
                            .setPlaceholder(`Anime Search Results (${animeResponse.length})`)
                            .setMaxValues(1)
                            .setMinValues(1)
                    )
                
                // Adding Search Results To Menu
                animeResponse.forEach(result => {
                    (resultNavigation.components[0] as MessageSelectMenu).addOptions(
                        {
                            label: `${result.title} | ${result.title_japanese ? result.title_japanese : 'No Japanese Title'}`,
                            value: `${result.mal_id}`
                        }
                    )
                })
                

                // Collector
                const message = await interaction.editReply({components: [resultNavigation]})
                const resultCollector: InteractionCollector<SelectMenuInteraction> = (message as Message).createMessageComponentCollector({
                    componentType: 'SELECT_MENU',
                    time: 30000
                })

                resultCollector.on('collect', async (i) => {
                    if (!i.customId.endsWith(i.user.id)) {
                        return i.reply({
                            content: 'This menu is not for you!',
                            ephemeral: true
                        })
                    }
                    
                    await i.deferUpdate()
                    resultCollector.stop(i.values[0])
                })

                resultCollector.on('end', async (collected, reason) => {
                    if (isNum(reason)) {
                        // Fetching info and displaying it
                        const waiting: MessageEmbed = new MessageEmbed()
                            .setDescription('Fetching data...')
                            .setColor('GREEN')
                        await interaction.editReply({embeds: [waiting], components: []})


                        const response = await fetch(`https://api.jikan.moe/v4/anime/${reason}/full`, {method: "GET"})
                        const anime = (await response.json()).data
                        animeInfo({anime: anime, interaction: interaction})
                        
                    } else {
                        (resultNavigation.components[0] as MessageSelectMenu).setDisabled(true)
                        await interaction.editReply({components: [resultNavigation]})
                    }
                })
                break
            }

            case 'character': {
                // Query
                const characterName: string = interaction.options.getString('name').toLowerCase()
                const query = `q=${characterName}&order_by=popularity&limit=10&sfw=true`
                const response = await fetch(`https://api.jikan.moe/v4/characters?${query}`, {method: "GET"})


                // Filtering
                const charResponse = (await response.json()).data
                if (charResponse.length == 0) {
                    const noResult: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription('No result can be found!')
                    return interaction.editReply({embeds: [noResult]})
                }
                const resultNavigation: MessageActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId(`CHARES-${interaction.user.id}`)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder(`Character Search Results (${charResponse.length})`)
                    )   
                charResponse.forEach(result => {
                    // Adding Search Results To Menu
                    (resultNavigation.components[0] as MessageSelectMenu).addOptions(
                        {
                            label: `${result.name} | ${result.name_kanji ? result.name_kanji : 'No Kanji Name'}`,
                            value: `${result.mal_id}`
                        }
                    )
                })


                // Collector
                const message = await interaction.editReply({components: [resultNavigation]})
                const resultCollector: InteractionCollector<SelectMenuInteraction> = await (message as Message).createMessageComponentCollector({
                    componentType: 'SELECT_MENU',
                    time: 30000
                })

                resultCollector.on('collect', async (i) => {
                    if (!i.customId.endsWith(i.user.id)) {
                        return i.reply({
                            content: 'This menu is not for you!',
                            ephemeral: true
                        })
                    }

                    await i.deferUpdate()
                    resultCollector.stop(i.values[0])
                })

                resultCollector.on('end', async (collected, reason) => {
                    if (isNum(reason)) {
                        // Awaiting
                        const waiting: MessageEmbed = new MessageEmbed()
                            .setDescription('Fetching character info...')
                            .setColor('GREEN')
                        await interaction.editReply({embeds: [waiting], components: []})


                        // Fetching Info
                        const response = await fetch(`https://api.jikan.moe/v4/characters/${reason}/full`, {method: "GET"})
                        const character = (await response.json()).data


                        // Sorting VA
                        let VAs: string[] = []
                        if (character.voices) {
                            character.voices.forEach(va => {
                                VAs.push(`[${va.person.name}](${va.person.url})`)
                            })    
                        }


                        // Embed
                        const characterEmbed: MessageEmbed = new MessageEmbed()
                            .setColor('RANDOM')
                            .setTitle(`${character.name} | ${character.name_kanji ? character.name_kanji : 'No Kanji Name'}`)
                            .setThumbnail(character.images.jpg.image_url)
                            .setDescription(character.about ? character.about : 'No Biography Found')
                        
                        // Validating Character Information
                        if (character.anime.length != 0) {
                            characterEmbed.addFields(
                                {
                                    name: 'Extra Info:',
                                    value: 
                                    `**Anime**: [${character.anime[0].anime.title}](${character.anime[0].anime.url})\n` +
                                    `**Voice Actors**: ${VAs.length != 0 ? VAs.join('; ') : 'None'}\n` +
                                    `**Nicknames**: ${character.nicknames.length != 0 ? character.nicknames.join(', ') : 'None'}`
                                },
                                {
                                    name: 'MyAnimeList Info',
                                    value:
                                    `**ID**: [${character.mal_id}](${character.url})\n` +
                                    `**Favorites**: ${character.favorites}`
                                }
                            )
                        } else {
                            characterEmbed.addField(
                                'MyAnimeList Info',
                                `**ID**: [${character.mal_id}](${character.url})\n` +
                                `**Favorites**: ${character.favorites}`
                            )
                        }

                        await interaction.editReply({embeds: [characterEmbed]})
                    } else {
                        // Disabling menu due to timeout
                        (resultNavigation.components[0] as MessageSelectMenu).setDisabled(true)
                        await interaction.editReply({components: [resultNavigation]})
                    }
                })
                break
            }

            case 'random': {
                // Fetching
                const response = await fetch(`https://api.jikan.moe/v4/random/anime`, {method: "GET"})
                const anime = (await response.json()).data

                animeInfo({anime: anime, interaction: interaction})
                break
            }
        }
    }
})
