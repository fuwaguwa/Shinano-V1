import { MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from 'node-fetch'

export async function azurLaneExpCalculator(interaction: ShinanoInteraction, AL: any) {
    await interaction.deferReply()

    const currentLevel = interaction.options.getInteger('current-level')
    const targetLevel = interaction.options.getInteger('target-level')
    const rarity = interaction.options.getString('rarity')
    

    if (currentLevel > 125 || targetLevel > 125) {
        const overboard: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('Level cannot go pass 125!')
        return interaction.editReply({embeds: [overboard]})
    }

    const expNeeded: MessageEmbed = new MessageEmbed()
        .setTitle('Experience Calculator')
        .setColor('BLUE')
    

    // 0 LEVEL DIFFERENCE
    if (currentLevel == targetLevel) {
        expNeeded
            .setDescription(`You will need **0 EXP** to get ${rarity === 'normal' ? 'a Normal ship' : 'an Ultra Rare ship'} from LV${currentLevel} to LV${targetLevel}`)
        return interaction.editReply({embeds: [expNeeded]})
    }

    if (currentLevel == 0 || targetLevel == 0) {
        const tooLow: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`${currentLevel == 0 ? "Ship\'s current level" : "Target level"} must be bigger than 0!`)
        return interaction.editReply({embeds: [tooLow]})
    }


    // EXP Calculation
    const response = await fetch('https://AmagiAPI.fuwafuwa08.repl.co/azur-lane/ship-stats', {
        method: "GET",
    })
    const data = (await response.json()).body



    let table: number[]
    rarity === 'normal'
        ? table = data.normal
        : table = data.ultraRare
    const expDifference = (table[targetLevel - 1]) - (table[currentLevel - 1])


    expNeeded
        .setDescription(`You will need **${expDifference.toLocaleString()} EXP** to get ${rarity === 'normal' ? 'a Normal ship' : 'an Ultra Rare ship'} from level **${currentLevel}** to level **${targetLevel}**`)
    return interaction.editReply({embeds: [expNeeded]})
}