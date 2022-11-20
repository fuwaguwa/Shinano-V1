import { Command } from "../../structures/Command";
import { AzurAPI } from "@azurapi/azurapi";
import { config } from 'dotenv'
import { azurLaneShip } from "./subcommands/azur-lane/ship";
import { azurLaneChapter } from "./subcommands/azur-lane/chapter";
import { azurLaneGear } from "./subcommands/azur-lane/gear";
import { azurLaneExpCalculator } from "./subcommands/azur-lane/exp-calculator";
import { azurLanePRCompletion } from "./subcommands/azur-lane/pr-completion";
import { azurLaneNews } from "./subcommands/azur-lane/news";
config()

const AL = new AzurAPI();


 
export default new Command({
    name: 'azur-lane',
    description: 'Get information related to Azur Lane!',
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
            name: 'news',
            description: "Send the latest tweets/news about the game for both EN and JP server from the official accounts!",
            options: [
                {
                    type: 'CHANNEL',
                    required: false,
                    channelTypes: ['GUILD_TEXT'],
                    name: 'channel',
                    description: 'The channel for the bot to send tweets into.'
                },
                {
                    type: 'BOOLEAN',
                    required: false,
                    name: 'stop',
                    description: 'Set to true if you want the bot to stop posting news!'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'exp',
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
            name: 'pr-completion',
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
                await azurLaneShip(interaction, AL)
                break
            }


            case 'chapter': {
                await azurLaneChapter(interaction, AL)
                break
            }


            case 'gear': {
                await azurLaneGear(interaction, AL)
                break
            }


            case 'exp': {
                await azurLaneExpCalculator(interaction)
                break
            }


            case 'pr-completion': {
                await azurLanePRCompletion(interaction, AL)
                break
            }   
            
            
            case 'news': {
                await azurLaneNews(interaction)
                break
            }
        }
    }
})
