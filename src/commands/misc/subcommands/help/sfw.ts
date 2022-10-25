import { MessageEmbed, MessageActionRow, MessageSelectMenu, InteractionCollector, SelectMenuInteraction, Message } from "discord.js";
import { ShinanoPaginator } from "../../../../structures/Pages";
import { ShinanoInteraction } from "../../../../typings/Command";

export async function shinanoHelpSFW(interaction: ShinanoInteraction) {
    await interaction.deferReply()
    // Setup 
    // Fun Embeds
    const funCommand1: MessageEmbed = new MessageEmbed()
    .setColor('#2f3136')
    .setDescription(`
        /<command>
        
        **8ball**
        <:curve:1021036738161950800>Ask the mighty 8ball
        **blackjack**
        <:curve:1021036738161950800>Play some blackjack with the bot
        **define**
        <:curve:1021036738161950800>Get a word's definition from Urban Dictionary
        **dadjoke**
        <:curve:1021036738161950800>Guranteed funny dadjoke
        **pick**
        <:curve:1021036738161950800>Let Shinano make decision for you!
        **match**
        <:curve:1021036738161950800>Checks two person love percentage
        **roll**
        <:curve:1021036738161950800>Roll a dice`
    )
    const funCommand2: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`
            /<command>
            
            **rps**
            <:curve:1021036738161950800>Play rock paper scissor against the bot!
            **ttt**
            <:curve:1021036738161950800>Play tictactoe against the bot or against someone!
            **trivia**
            <:curve:1021036738161950800>Start a trivia question!`
        )
    


    
    // Image Embeds
    const imageCommand1: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`
            /<command>
            
            **bronya**
            <:curve:1021036738161950800>Bronya's certificate
            **cat**
            <:curve:1021036738161950800>Generate a picture of a cat
            **dog**
            <:curve:1021036738161950800>Generate a picture of a dog
            **fox**
            <:curve:1021036738161950800>Send an image of a fox!
            **gay**
            <:curve:1021036738161950800>Taste the rainbow
            **jail**
            <:curve:1021036738161950800>Go to horny jail!
            **nekomimi**
            <:curve:1021036738161950800>Generate a (SFW) picture of a catgirl!`
        )
    const imageCommand2: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`
            /<command>

            **rip**
            <:curve:1021036738161950800>*dies*
            **shit**
            <:curve:1021036738161950800>Put a bounty on someone
            **sigma**
            <:curve:1021036738161950800>Sigma Grindset`
        )

    
    // Misc Embeds
    const miscCommand1: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`
            /<command>
            
            **bot**
            <:curve:1021036738161950800>Information about the bot
            **shinano-help**
            <:curve:1021036738161950800>Information about all of Shinano's commands`
        )



    // Reactions Embed
    const reactionCommand1: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`
            /<command>
            
            **bite**
            <:curve:1021036738161950800>nom nom nom
            **blush**
            <:curve:1021036738161950800>😳
            **cringe**
            <:curve:1021036738161950800>Cringe at someone
            **cuddle**
            <:curve:1021036738161950800>uwu you so snuggable
            **handhold**
            <:curve:1021036738161950800>Lewd!
            **hug**
            <:curve:1021036738161950800>uwu you so warm
            **kiss**
            <:curve:1021036738161950800>Kiss someone!`
        )
    const reactionCommand2: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`
            /<command>
            
            **lick**
            <:curve:1021036738161950800>...wtf?
            **pat**
            <:curve:1021036738161950800>'Cause everyone needs headpats
            **poke**
            <:curve:1021036738161950800>Poke someone
            **slap**
            <:curve:1021036738161950800>Eat that, sucker.
            **smile**
            <:curve:1021036738161950800>Ehe.`
        )



    // Utils Embeds
    const utilsCommand1: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`
            /<command>
            
            **avatar**
            <:curve:1021036738161950800>Get someone's avatar
            **banner**
            <:curve:1021036738161950800>Get someone's banner
            **id**
            <:curve:1021036738161950800>Get someone's UID`
        )
            
    


    // Azur Lane
    const alCommand1: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`
            /azur-lane <command>
            
            **ship**
            <:curve:1021036738161950800>Get info about an Azur Lane ship
            **chapter**
            <:curve:1021036738161950800>Get info about an Azur Lane chapter
            **gear**
            <:curve:1021036738161950800>Get info about an Azur Lane gear
            **exp**
            <:curve:1021036738161950800>Calculate the EXP needed to get your ship to the desired level
            **pr-completion**
            <:curve:1021036738161950800>Calculate your PR completion!`

        )


    // Anime 
    const aniCommand1: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`
            /anime <command>

            **search**
            <:curve:1021036738161950800>Search up an anime on MyAnimeList.
            **character**
            <:curve:1021036738161950800>Search up an anime character on MyAnimeList.
            **random**
            <:curve:1021036738161950800>Return a random anime on MyAnimeList.`
        )


    // Genshin 
    const genshinCommand1: MessageEmbed = new MessageEmbed()
    .setColor('#2f3136')
    .setDescription(`
        /genshin <command>

        **character**
        <:curve:1021036738161950800>Return information on a Genshin character.
        **weapon**
        <:curve:1021036738161950800>Return information on a Genshin weapon.
        **material**
        <:curve:1021036738161950800>Return information on a Genshin material.
        **artifact**
        <:curve:1021036738161950800>Return information on a Genshin artifact set.
        **enemy**
        <:curve:1021036738161950800>Return information on a Genshin enemy.`
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
    const miscCommands: MessageEmbed[] = [
        miscCommand1
    ]
    const reactionCommands: MessageEmbed[] = [
        reactionCommand1,
        reactionCommand2,
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
    const genshinCommands: MessageEmbed[] = [
        genshinCommand1
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
                        label: 'Genshin',
                        description: 'Genshin utilities commands!',
                        value: 'genshin',
                        default: false,
                        emoji: '⚔️'
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
        menu: navigation,
        pages: funCommands,
        interactorOnly: true,
        timeout: 30000
    })

    // Collector
    const collector: InteractionCollector<SelectMenuInteraction> = await (message as Message).createMessageComponentCollector({
        componentType: 'SELECT_MENU',
        time: 30000
    })

    collector.on('collect', async (i) => {
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
                    timeout: 30000,
                    menu: navigation,
                    interactorOnly: true,
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
                    timeout: 30000,
                    menu: navigation,
                    interactorOnly: true,
                    pages: imageCommands
                })
                break
            }


            case 'misc': {
                for (let i = 0; i < select.options.length; i++) {
                    i == 2
                        ? select.options[i].default = true
                        : select.options[i].default = false
                }

                ShinanoPaginator({
                    interaction: interaction,
                    timeout: 30000,
                    menu: navigation,
                    interactorOnly: true,
                    pages: miscCommands
                })
                break
            }


            case 'reactions': {
                for (let i = 0; i < select.options.length; i++) {
                    i == 3
                        ? select.options[i].default = true
                        : select.options[i].default = false
                }

                ShinanoPaginator({
                    interaction: interaction,
                    timeout: 30000,
                    menu: navigation,
                    interactorOnly: true,
                    pages: reactionCommands
                })
                break
            }


            case 'utilities': {
                for (let i = 0; i < select.options.length; i++) {
                    i == 4
                        ? select.options[i].default = true
                        : select.options[i].default = false
                }

                ShinanoPaginator({
                    interaction: interaction,
                    timeout: 30000,
                    menu: navigation,
                    interactorOnly: true,
                    pages: utilsCommands
                })
                break
            }


            case 'azur-lane': {
                for (let i = 0; i < select.options.length; i++) {
                    i == 5
                        ? select.options[i].default = true
                        : select.options[i].default = false
                }

                ShinanoPaginator({
                    interaction: interaction,
                    timeout: 30000,
                    menu: navigation,
                    interactorOnly: true,
                    pages: alCommands
                })
                break
            }


            case 'genshin': {
                for (let i = 0; i < select.options.length; i++) {
                    i == 6
                        ? select.options[i].default = true
                        : select.options[i].default = false
                }

                ShinanoPaginator({
                    interaction: interaction,
                    timeout: 30000,
                    menu: navigation,
                    interactorOnly: true,
                    pages: genshinCommands
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
                    timeout: 30000,
                    menu: navigation,
                    interactorOnly: true,
                    pages: aniCommands
                })
                break
            }

        }
        collector.resetTimer()
    })
}