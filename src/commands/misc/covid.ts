import { Command } from "../../structures/Command";
import { MessageEmbed } from "discord.js";
import fetch from 'node-fetch'
import { config } from 'dotenv'
config();

function addCommas(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default new Command({
    name:'covid',
    description:'Covid Information',
    cooldown: 4500,
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'country',
            description: 'Show info about COVID in a country.',
            options: [
                {
                    required: true,
                    name: 'country',
                    description: 'Country.',
                    type: 'STRING'
                }
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'world',
            description: 'Show info about COVID in the world.',
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()

        // Decide the country
        let country: string
        interaction.options.getSubcommand() === 'world'
            ? country = 'all'
            : country = interaction.options.getString('country')
        
        const response = await fetch(`https://covid-193.p.rapidapi.com/statistics?country=${country}`, {
            method: "GET",
            headers: {
                'X-RapidAPI-Host': 'covid-193.p.rapidapi.com',
                'X-RapidAPI-Key': process.env.rapidApiKey
            }
        })
        const covid = await response.json()
        

        // No Results
        if (covid.results === 0) {
            const noResult: MessageEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription('Couldn\'t find the country!')
            return interaction.editReply({embeds: [noResult]})
        }


        // Yes Results
        const covidResponse = covid.response[0]
        const covidInfo = {
            "results": covid.results,
            "newCases": covidResponse.cases.new,
            "activeCases": covidResponse.cases.active,
            "recovered": covidResponse.cases.recovered,
            "totalCases": covidResponse.cases.total,
            "newDeaths": covidResponse.deaths.new,
            "totalDeaths": covidResponse.deaths.total,
            "country": covidResponse.country
        }


        // Outputting Information
        const covidEmbed = new MessageEmbed()
            .setTitle(`Covid Statistics In ${
                interaction.options.getSubcommand() === 'world'
                    ? "The World"
                    : covidInfo.country
            }`)
            .setColor('#548ed1')
            .setFields(
                {name:'Cases Today', value:`${
                    !covidInfo.newCases
                        ? "+0"
                        : addCommas(covidInfo.newCases)
            }`, inline: true},
                {name:'Active Cases', value:`${
                    !covidInfo.activeCases
                        ? "+0"
                        : addCommas(covidInfo.activeCases)
            }`, inline: true},
                {name:'Total Cases', value:`${addCommas(covidInfo.totalCases)}`, inline: true},
                {name:'Recovered Cases', value:`${addCommas(covidInfo.recovered)}`, inline: true},
                {name:'Deaths Today', value:`${
                    !covidInfo.newDeaths
                        ? "+0"
                        : addCommas(covidInfo.newDeaths)
                }`, inline: true},
                {name:'Total Deaths', value:`${addCommas(covidInfo.totalDeaths)}`, inline: true}
            )
            .setThumbnail('https://cdn.discordapp.com/attachments/1002188088942022810/1021422793360949308/coronavirus-square-800.jpg')
        await interaction.editReply({embeds:[covidEmbed]})
    }
})