import { Command } from "../../structures/Command";
import { InteractionCollector, Message, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, SelectMenuInteraction, TextChannel } from "discord.js";
import { ShinanoPaginator } from "../../structures/Pages";

export default new Command({
    name: 'help',
    description: 'Send a list of commands',
    cooldown: 4500,
    options: [
        {
            type: 'STRING',
            required: true,
            name: 'type',
            description: 'Type of commands.',
            choices: [
                {name: 'Normal Commands', value: 'sfw'},
                {name: 'NSFW Commands', value: 'nsfw'}
            ]
        },
    ],
    run: async({interaction}) => {
        switch (interaction.options.getString('type')) {
            case 'sfw': {
                await interaction.deferReply()
                // Setup 
                // Fun Embeds
                const funCommand1: MessageEmbed = new MessageEmbed()
                .setColor('BLUE')
                .setDescription(`
                    /<command>
                    
                    **8ball**
                    <:rmal:1021036738161950800>Ask the mighty 8ball
                    **blackjack**
                    <:rmal:1021036738161950800>Play some blackjack with the bot
                    **define**
                    <:rmal:1021036738161950800>Get a word's definition from Urban Dictionary
                    **dadjoke**
                    <:rmal:1021036738161950800>Guranteed funny dadjoke
                    **fact**
                    <:rmal:1021036738161950800>Get a fact about an animal
                    **match**
                    <:rmal:1021036738161950800>Checks two person love percentage
                    **roll**
                    <:rmal:1021036738161950800>Roll a dice`
                )
                const funCommand2: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`
                        /<command>
                        
                        **rps**
                        <:rmal:1021036738161950800>Play rock paper scissor against the bot!
                        **ttt**
                        <:rmal:1021036738161950800>Play tictactoe against the bot or against someone!
                        **trivia**
                        <:rmal:1021036738161950800>Start a trivia question!`
                    )
                


                
                // Image Embeds
                const imageCommand1: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`
                        /<command>
                        
                        **bronya**
                        <:rmal:1021036738161950800>Bronya's certificate
                        **cat**
                        <:rmal:1021036738161950800>Generate a picture of a cat!
                        **dog**
                        <:rmal:1021036738161950800>Generate a picture of a dog!
                        **fox**
                        <:rmal:1021036738161950800>Generate a picture of a fox!
                        **gay**
                        <:rmal:1021036738161950800>Taste the rainbow
                        **jail**
                        <:rmal:1021036738161950800>Go to horny jail!
                        **nekomimi**
                        <:rmal:1021036738161950800>Generate a (SFW) picture of a catgirl!`
                    )
                const imageCommand2: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`
                        /<command>
                        
                        **pixelate**
                        <:rmal:1021036738161950800>64 bits, 32 bits, 16 bits, 8 bits, ...
                        **rip**
                        <:rmal:1021036738161950800>*dies*
                        **sigma**
                        <:rmal:1021036738161950800>Sigma Grindset
                        **wanted**
                        <:rmal:1021036738161950800>Put a bounty on someone
                        **upscale**
                        <:rmal:1021036738161950800>Upscale an image using DeepAI`
                    )



                // Management Embeds
                const managementCommand1: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`
                        /<command>
                        
                        **purge**
                        <:rmal:1021036738161950800>Purge messages that aren't older than 14 days
                        **role**
                        <:rmal:1021036738161950800>Add or remove roles from someone`
                    )
                


                
                // Misc Embeds
                const miscCommand1: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`
                        /<command>
                        
                        **bot**
                        <:rmal:1021036738161950800>Information about the bot
                        **covid**
                        <:rmal:1021036738161950800>Information about COVID
                        **help**
                        <:rmal:1021036738161950800>Information about commands`
                    )



                // Reactions Embed
                const reactionCommand1: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`
                        /<command>
                        
                        **bite**
                        <:rmal:1021036738161950800>nom nom nom
                        **blush**
                        <:rmal:1021036738161950800>😳
                        **cringe**
                        <:rmal:1021036738161950800>Cringe at someone
                        **cuddle**
                        <:rmal:1021036738161950800>uwu you so snuggable
                        **glomp**
                        <:rmal:1021036738161950800>Give someone an affectionate hug!
                        **handhold**
                        <:rmal:1021036738161950800>Lewd!
                        **hug**
                        <:rmal:1021036738161950800>uwu you so warm`
                    )
                const reactionCommand2: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`
                        /<command>
                        
                        **kiss**
                        <:rmal:1021036738161950800>Kiss someone!
                        **lick**
                        <:rmal:1021036738161950800>...wtf?
                        **pat**
                        <:rmal:1021036738161950800>'Cause everyone needs headpats
                        **poke**
                        <:rmal:1021036738161950800>Poke someone
                        **slap**
                        <:rmal:1021036738161950800>Eat that, sucker.
                        **smile**
                        <:rmal:1021036738161950800>Ehe.
                        **smug**
                        <:rmal:1021036738161950800>mmmmmmm`
                    )
                const reactionCommand3: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`
                        /<command>
                        **wink**
                        <:rmal:1021036738161950800>Wink at someone`
                    )



                // Utils Embeds
                const utilsCommand1: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`
                        /<command>
                        
                        **announce**
                        <:rmal:1021036738161950800>Announce something using the bot
                        **avatar**
                        <:rmal:1021036738161950800>Get someone's avatar
                        **banner**
                        <:rmal:1021036738161950800>Get someone's banner
                        **id**
                        <:rmal:1021036738161950800>Get someone's UID
                        **info**
                        <:rmal:1021036738161950800>Get info about the current guild or an user
                        **snipe**
                        <:rmal:1021036738161950800>Get the most recently deleted message`
                    )
                        
                


                // Azur Lane
                const alCommand1: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`
                        /azur-lane <command>
                        
                        **ship**
                        <:rmal:1021036738161950800>Get info about an Azur Lane ship
                        **chapter**
                        <:rmal:1021036738161950800>Get info about an Azur Lane chapter
                        **gear**
                        <:rmal:1021036738161950800>Get info about an Azur Lane gear
                        **exp-calculator**
                        <:rmal:1021036738161950800>Calculate the EXP needed to get your ship to the desired level
                        **pr-completion-calculator**
                        <:rmal:1021036738161950800>Calculate your PR completion!`

                    )


                // Anime 
                const aniCommand1: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(`
                        /anime <command>

                        **search**
                        <:rmal:1021036738161950800>Search up an anime on MyAnimeList.
                        **character**
                        <:rmal:1021036738161950800>Search up an anime character on MyAnimeList.
                        **random**
                        <:rmal:1021036738161950800>Return a random anime on MyAnimeList.`
                    )


                // Embeds Array
                const funCommands: MessageEmbed[] = [
                    funCommand1,
                    funCommand2,
                ]
                const imageCommands: MessageEmbed[] = [
                    imageCommand1,
                    imageCommand2
                ]
                const managementCommands: MessageEmbed[] = [
                    managementCommand1
                ]
                const miscCommands: MessageEmbed[] = [
                    miscCommand1
                ]
                const reactionCommands: MessageEmbed[] = [
                    reactionCommand1,
                    reactionCommand2,
                    reactionCommand3
                ]
                const utilsCommands: MessageEmbed[] = [
                    utilsCommand1
                ]
                const alCommands: MessageEmbed[] = [
                    alCommand1
                ]
                const aniCommands: MessageEmbed[] = [
                    aniCommand1
                ]

                // Selection Menu
                const navigation = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId(`NAVCAT-${interaction.user.id}`)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setDisabled(false)
                            .addOptions(
                                {
                                    label: 'Fun',
                                    value: 'fun',
                                    description: 'Entertain yourself with these commands!',
                                    default: true,
                                    emoji: '🎉'
                                },
                                {
                                    label: 'Image',
                                    description: 'Generate (catgirls) images and manipulate them with these commands!',
                                    value: 'image',
                                    default: false,
                                    emoji: '📸'
                                },
                                {
                                    label: 'Management',
                                    description: 'Commands that help you with managing your server!',
                                    value: 'management',
                                    default: false,
                                    emoji: '⚙'
                                },
                                {
                                    label: 'Misc',
                                    description: 'Miscellaneous Commands.',
                                    value: 'misc',
                                    default: false,
                                    emoji: '⭐'
                                },
                                {
                                    label: 'Reactions',
                                    description: 'React to a friend with these commands!',
                                    value: 'reactions',
                                    default: false,
                                    emoji: '😊'
                                },
                                {
                                    label: 'Utilities',
                                    description: 'Utilities Commands.',
                                    value: 'utilities',
                                    default: false,
                                    emoji: '🛠'
                                },
                                {
                                    label: 'Azur Lane',
                                    description: 'Azur Lane utilities commands!',
                                    value: 'azur-lane',
                                    default: false,
                                    emoji: '⚓'
                                },
                                {
                                    label: 'Anime',
                                    description: 'Search up information about an anime/anime character!',
                                    value: 'anime',
                                    default: false,
                                    emoji: '🎎'
                                },
                            )
                    )

                
                const message = await interaction.editReply({
                    embeds: [funCommand1],
                    components: [navigation]
                })
                ShinanoPaginator({
                    interaction: interaction,
                    menuId: 'NAVCAT',
                    menu: navigation,
                    pages: funCommands,
                    interactor_only: true,
                    timeout: 30000
                })

                // Collector
                const collector: InteractionCollector<SelectMenuInteraction> = await (message as Message).createMessageComponentCollector({
                    componentType: 'SELECT_MENU',
                    time: 30000
                })

                collector.on('collect', async (i) => {
                    const customID = i.customId.split('-')[0]
                    
                    if (!i.customId.endsWith(i.user.id)) {
                        return i.reply({
                            content: 'This menu is not for you!',
                            ephemeral: true
                        })
                    }
                    
                    const select = navigation.components[0] as MessageSelectMenu
                    await i.deferUpdate()
                    switch (i.values[0]) {
                        case 'fun': {
                            for (let i = 0; i < select.options.length; i++) {
                                i == 0
                                    ? select.options[i].default = true
                                    : select.options[i].default = false
                            }

                            ShinanoPaginator({
                                interaction: interaction,
                                menuId: 'NAVCAT',
                                timeout: 30000,
                                menu: navigation,
                                interactor_only: true,
                                pages: funCommands
                            })
                            break
                        }

                        case 'image': {
                            for (let i = 0; i < select.options.length; i++) {
                                i == 1
                                    ? select.options[i].default = true
                                    : select.options[i].default = false
                            }

                            ShinanoPaginator({
                                interaction: interaction,
                                menuId: 'NAVCAT',
                                timeout: 30000,
                                menu: navigation,
                                interactor_only: true,
                                pages: imageCommands
                            })
                            break
                        }

                        case 'management': {
                            for (let i = 0; i < select.options.length; i++) {
                                i == 2
                                    ? select.options[i].default = true
                                    : select.options[i].default = false
                            }

                            ShinanoPaginator({
                                interaction: interaction,
                                menuId: 'NAVCAT',
                                timeout: 30000,
                                menu: navigation,
                                interactor_only: true,
                                pages: managementCommands
                            })
                            break
                        }

                        case 'misc': {
                            for (let i = 0; i < select.options.length; i++) {
                                i == 3
                                    ? select.options[i].default = true
                                    : select.options[i].default = false
                            }

                            ShinanoPaginator({
                                interaction: interaction,
                                menuId: 'NAVCAT',
                                timeout: 30000,
                                menu: navigation,
                                interactor_only: true,
                                pages: miscCommands
                            })
                            break
                        }

                        case 'reactions': {
                            for (let i = 0; i < select.options.length; i++) {
                                i == 4
                                    ? select.options[i].default = true
                                    : select.options[i].default = false
                            }

                            ShinanoPaginator({
                                interaction: interaction,
                                menuId: 'NAVCAT',
                                timeout: 30000,
                                menu: navigation,
                                interactor_only: true,
                                pages: reactionCommands
                            })
                            break
                        }

                        case 'utilities': {
                            for (let i = 0; i < select.options.length; i++) {
                                i == 5
                                    ? select.options[i].default = true
                                    : select.options[i].default = false
                            }

                            ShinanoPaginator({
                                interaction: interaction,
                                menuId: 'NAVCAT',
                                timeout: 30000,
                                menu: navigation,
                                interactor_only: true,
                                pages: utilsCommands
                            })
                            break
                        }

                        case 'azur-lane': {
                            for (let i = 0; i < select.options.length; i++) {
                                i == 6
                                    ? select.options[i].default = true
                                    : select.options[i].default = false
                            }

                            ShinanoPaginator({
                                interaction: interaction,
                                menuId: 'NAVCAT',
                                timeout: 30000,
                                menu: navigation,
                                interactor_only: true,
                                pages: alCommands
                            })
                            break
                        }

                        case 'anime': {
                            for (let i = 0; i < select.options.length; i++) {
                                i == 7
                                    ? select.options[i].default = true
                                    : select.options[i].default = false
                            }

                            ShinanoPaginator({
                                interaction: interaction,
                                menuId: 'NAVCAT',
                                timeout: 30000,
                                menu: navigation,
                                interactor_only: true,
                                pages: aniCommands
                            })
                            break
                        }

                    }
                    collector.resetTimer()
                })
                break
            }

            case 'nsfw': {
                // NSFW Check 
                if (!(interaction.channel as TextChannel).nsfw) {
                    const nsfwErrorEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle('NSFW Command')
                        .setDescription('NSFW commands can only be used in NSFW channels!')
                    return interaction.reply({embeds: [nsfwErrorEmbed], ephemeral: true})
                }

                const navigation: MessageActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle('SECONDARY')
                            .setLabel('Can\'t see NSFW commands?')
                            .setCustomId('NONSFW')
                    )

                const nsfwEmbed = new MessageEmbed()
                    .setTitle('NSFW Commands')
                    .setColor('BLUE')
                    .setDescription('Tip: You can quickly type `/<tag>` or `/<category>` for the commands. E.g `/random`, `/porn`')
                    .setFields(
                        {name: 'Sauce Lookup Command:', value: '`/sauce`'},
                        {name: "/nsfw hentai <tag>", value:"`anal`, `ass`, `blowjob`, `bomb`, `boobs`, `cum`, `elf`, `feet`, `genshin`, `gif`, `kemonomimi`, `masturbation`, `nekomimi`, `paizuri`, `pussy`, `random`, `shipgirls`, `succubus`, `thighs`, `undies`, `vtubers`, `yuri`"},
                        {name: "/nsfw porn <tag>", value: "`anal`, `ass`, `blowjob`, `boobs`, `cosplay`,`cum`, `random`, `pussy`, `video`"},
                    )
                await interaction.reply({embeds:[nsfwEmbed], components: [navigation]})
                break
            }
        }
    }
})
