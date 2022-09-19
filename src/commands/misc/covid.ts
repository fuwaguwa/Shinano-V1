import { Command } from "../../structures/Command";
import { MessageEmbed } from "discord.js";
import fetch from 'node-fetch'
import {config} from 'dotenv'
config();

export default new Command({
    name:'covid',
    description:'Covid Information',
    cooldown: 4500,
    options: [
        {
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
            type: 'SUB_COMMAND'
        },
        {
            name: 'world',
            description: 'Show info about COVID in the world.',
            type: 'SUB_COMMAND'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()

        var country: String
        interaction.options.getSubcommand() === 'world'
            ? country = 'all'
            : country = interaction.options.getString('country')
        
        function AddCommas(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        
        const response = await fetch(`https://covid-193.p.rapidapi.com/statistics?country=${country}`, {
            method: "GET",
            headers: {
                'X-RapidAPI-Host': 'covid-193.p.rapidapi.com',
                'X-RapidAPI-Key': process.env['rapidApiKey']
            }
        })
        const covid = await response.json()
        
        let covidResults;
        if (covid['results'] === 0) {
            covidResults = {
                "results": covid['results']
            }
        } else {
            covidResults = {
                "results" : covid['results'],
                "newCases": covid['response'][0]['cases']['new'],
                "activeCases": covid['response'][0]['cases']['active'],
                "recovered": covid['response'][0]['cases']['recovered'],
                "totalCases": covid['response'][0]['cases']['total'],
                "newDeaths": covid['response'][0]['deaths']['new'],
                "totalDeaths": covid['response'][0]['deaths']['total'],
                "country": covid['response'][0]['country']
            }
        }

        if (covid['results'] === 0) {
            let epicFailEmbed = new MessageEmbed()
                .setDescription('Couldn\'t find the country!')
                .setColor('RED')
            await interaction.editReply({embeds: [epicFailEmbed]})
        } else {
            let covidEmbed = new MessageEmbed()
                .setTitle(`Covid Statistics In ${
                    interaction.options.getSubcommand() === 'world'
                        ? "The World"
                        : covidResults.country
                }`)
                .setColor('#548ed1')
                .setFields(
                    {name:'Cases Today', value:`${
                        covidResults.newCases === null
                            ? "+0"
                            : AddCommas(covidResults.newCases)
                }`, inline: true},
                    {name:'Active Cases', value:`${
                        covidResults.activeCases === null
                            ? "+0"
                            : AddCommas(covidResults.activeCases)
                }`, inline: true},
                    {name:'Total Cases', value:`${AddCommas(covidResults.totalCases)}`, inline: true},
                    {name:'Recovered Cases', value:`${AddCommas(covidResults.recovered)}`, inline: true},
                    {name:'Deaths Today', value:`${
                        covidResults.newDeaths === null
                            ? "+0"
                            : AddCommas(covidResults.newDeaths)
                    }`, inline: true},
                    {name:'Total Deaths', value:`${AddCommas(covidResults.totalDeaths)}`, inline: true}
                )
                .setThumbnail('https://coastalhealthdistrict.org/wp-content/uploads/2020/02/coronavirus-square-800.jpg')
            await interaction.editReply({embeds:[covidEmbed]})
        }
    }
})