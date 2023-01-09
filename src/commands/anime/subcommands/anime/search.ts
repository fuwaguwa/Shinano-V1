import { MessageEmbed, MessageActionRow, MessageSelectMenu, InteractionCollector, SelectMenuInteraction, Message } from "discord.js"
import { animeInfo } from "../../../../lib/Anime"
import { ShinanoInteraction } from "../../../../typings/Command"
import fetch from 'node-fetch'


export async function animeSearch(interaction: ShinanoInteraction) {
    const animeName: string = interaction.options.getString('name').toLowerCase()
    const animeType: string = interaction.options.getString('type')

    const query = `q=${animeName}&limit=10&order_by=popularity&type=${animeType}&sfw=true`
    const response = await fetch(`https://api.jikan.moe/v4/anime?${query}`, {method: "GET"})


    // Filtering
    const animeResponse = (await response.json()).data
    if (animeResponse.length == 0) {
        const noResult: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('❌ | No result can be found!')
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
                label: `${result.title}`,
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
}