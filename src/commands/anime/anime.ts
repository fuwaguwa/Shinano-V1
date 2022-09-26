import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { config } from "dotenv";
import { isNum } from '../../structures/Utils'
import { animeInfo, characterInfo } from "../../structures/Anime";
import { InteractionCollector, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
config();

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

                
                // Menu
                const resultNavigation: MessageActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId(`RES-${interaction.user.id}`)
                            .setPlaceholder(`Anime Search Results (${animeResponse.length})`)
                            .setMaxValues(1)
                            .setMinValues(1)
                    )
                
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
                    time: 120000
                })

                resultCollector.on('collect', async (i) => {
                    if (!i.customId.endsWith(i.user.id)) {
                        return i.reply({
                            content: 'This menu is not for you!',
                            ephemeral: true
                        })
                    }
                    
                    await i.deferUpdate()

                    // Fetching Anime Information
                    const response = await fetch(`https://api.jikan.moe/v4/anime/${i.values[0]}/full`, {method: "GET"})
                    const anime = (await response.json()).data

                    // Setting Default Buttons
                    const menu = (resultNavigation.components[0] as MessageSelectMenu)
                    for (let n = 0; n < menu.options.length; n++) {
                        (resultNavigation.components[0] as MessageSelectMenu).options[n].value === i.values[0]
                            ?  menu.options[n].default = true
                            :  menu.options[n].default = false;
                    }

                    animeInfo({anime: anime, interaction: interaction, menu: resultNavigation})

                    resultCollector.resetTimer()
                })

                resultCollector.on('end', async (collected, reason) => {
                    (resultNavigation.components[0] as MessageSelectMenu).setDisabled(true)
                    await interaction.editReply({components: [resultNavigation]})
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


                // Menu
                const resultNavigation: MessageActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId(`CHARES-${interaction.user.id}`)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder(`Character Search Results (${charResponse.length})`)
                    )   
                
                charResponse.forEach(result => {
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
                    time: 120000
                })

                resultCollector.on('collect', async (i) => {
                    if (!i.customId.endsWith(i.user.id)) {
                        return i.reply({
                            content: 'This menu is not for you!',
                            ephemeral: true
                        })
                    }

                    await i.deferUpdate()
                    
                    // Fetching Character Info
                    const response = await fetch(`https://api.jikan.moe/v4/characters/${i.values[0]}/full`, {method: "GET"})
                    const character = (await response.json()).data

                    // Sorting VAs
                    let VAs: string[] = []
                    if (character && character.voices) {
                        character.voices.forEach(va => {
                            VAs.push(`[${va.person.name}](${va.person.url})`)
                        })    
                    }

                    // Character Embed
                    const characterEmbed = characterInfo({character: character, VAs: VAs})

                    // Setting Default Buttons
                    const menu = (resultNavigation.components[0] as MessageSelectMenu)
                    for (let n = 0; n < menu.options.length; n++) {
                        (resultNavigation.components[0] as MessageSelectMenu).options[n].value === i.values[0]
                            ?  menu.options[n].default = true
                            :  menu.options[n].default = false;
                    }
                    await interaction.editReply({embeds: [characterEmbed], components: [resultNavigation]})

                    resultCollector.resetTimer()
                })

                resultCollector.on('end', async (collected, reason) => {
                    // Disable button on timeout
                    (resultNavigation.components[0] as MessageSelectMenu).setDisabled(true);
                    await interaction.editReply({components: [resultNavigation]})
                })

                break
            }


            case 'random': {
                // Fetching
                const response = await fetch(`https://api.jikan.moe/v4/random/anime`, {method: "GET"})
                const anime = (await response.json()).data

                animeInfo({anime: anime, interaction: interaction, menu: null})
                break
            }
        }
    }
})
