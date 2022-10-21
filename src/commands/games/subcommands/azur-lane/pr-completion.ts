import { MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from 'node-fetch';

export async function azurLanePRCompletion(interaction: ShinanoInteraction, AL: any) {
    /*
        Helpful comments stop here, I don't know what I did but it sure as hell did work out perfectly fine 💀
    */

    // Receiving and processing data
    const shipName: string = interaction.options.getString('ship-name').toLowerCase()
    let devLevel: number = interaction.options.getInteger('dev-level')
    const unusedBPs: number = interaction.options.getInteger('unused-bps')
    let fateSimLevel: number
    let totalPRBPs: number
    let prTable: number[]
    let prFSTable: number[]
    let prFSTableTotal: number[]
    let color: any


    const response = await fetch('https://AmagiAPI.fuwafuwa08.repl.co/azur-lane/ship-stats', {
        method: "GET",
    })
    const data = (await response.json()).body


    if (!interaction.options.getString('fate-sim-level')) {
        fateSimLevel = 0
    } else {
        fateSimLevel = parseInt(interaction.options.getString('fate-sim-level'), 10)
        devLevel = 30
    }


    // Validating Ship
    const ship: any = await AL.ships.get(shipName)
    if (!ship) {
        const shipNotFound: MessageEmbed = new MessageEmbed()
            .setDescription('Ship not found!')
            .setColor('RED')
        return interaction.reply({embeds:[shipNotFound], ephemeral: true})
    }

    if (ship.rarity !== 'Priority' && ship.rarity !== 'Decisive') {
        const shipNotPR: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('The ship is not a PR ship!')
        return interaction.reply({embeds: [shipNotPR]})
    }


    // Assigning PR/DR table
    if (ship.rarity === 'Priority') {
        color = 'GOLD'
        prTable = data.PR
        prFSTable = data["PR-FS"]
        prFSTableTotal = data["PR-FS-TOTAL"]
        totalPRBPs = prTable[30] + prFSTable[5]
    } else {
        color = 'BLACK'
        prTable = data.DR
        prFSTable = data["DR-FS"]
        prFSTableTotal = data["DR-FS-TOTAL"]
        totalPRBPs = prTable[30] + prFSTable[5]
    }


    // Validating Data
    if (unusedBPs < 0 || devLevel < 0 || fateSimLevel < 0 || ((unusedBPs > totalPRBPs) && (devLevel > 0)) || devLevel > 30) {
        const impossible: MessageEmbed = new MessageEmbed()
            .setDescription('Your inputted data is wrong, please check again')
            .setColor('RED')
        return interaction.reply({embeds: [impossible]})
    }


    // MATH
    await interaction.deferReply()
    function closest(num: number, array: number[]) {
        let curr = array[0]
        for (let i = 0; i < array.length; i++) {
            if (Math.abs(num - array[i]) < Math.abs(num - curr)) {
                curr = array[i]
            }
        }
        return array.indexOf(curr)
    }

    const totalBPs: number = fateSimLevel > 0 ? prTable[30] + prFSTable[fateSimLevel] + unusedBPs : prTable[devLevel] + unusedBPs
    const BPsAwayFromDev30: number = prTable[30] - totalBPs < 0 ? 0 : prTable[30] - totalBPs
    const BPsAwayFromFS5: number = (prTable[30] + prFSTable[5]) - totalBPs
    const PRcompletionPercentage: number = fateSimLevel > 0 ? 100 : (totalBPs / prTable[30]) * 100
    const PRcompletionPercentageFS: number = (totalBPs / (prTable[30] + prFSTable[5])) * 100
    const finalDevLevel: number = closest(totalBPs, prTable)
    const finalFSLevel: number = closest(totalBPs, prFSTableTotal)


    const completion: MessageEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`PR Completion | ${ship.rarity} | ${ship.names.en}`)
        .setThumbnail(ship.thumbnail)
        .addFields(
            {name: 'Ship Info:', value:
            `Unused BPs: **${unusedBPs}**\n` +
            `Dev Level: **${devLevel}**\n` +
            `Fate Sim Level: **${fateSimLevel}**`},

            {name: 'Current PR Progress:', value: 
            `Total BPs: **${totalBPs}**\n`+
            `BPs until Dev 30: **${BPsAwayFromDev30}**\n`+
            `BPs until Fate Sim 5: **${BPsAwayFromFS5}**\n`+
            `Final Dev Level: **${finalDevLevel}**\n` +
            `Final Fate Sim Level: **${finalFSLevel}**\n` +
            `PR Completion: **${PRcompletionPercentage.toFixed(2)}%**\n` +
            `PR Completion (with Fate Sim): **${PRcompletionPercentageFS.toFixed(2)}%**`}
        )
        .setFooter({text: 'Fate Sim is included regardless even if the ship does not have Fate Sim in game.'})
    await interaction.editReply({embeds: [completion]})
}