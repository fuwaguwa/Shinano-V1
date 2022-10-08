import { codeBlock } from "@discordjs/builders";
import { ShinanoInteraction } from "../../../typings/Command";
import util from 'util'

export async function devEval(interaction: ShinanoInteraction) {
    const code: string = interaction.options.getString('code')

    let output: string = await new Promise((resolve, reject) => {resolve(eval(code))})
    if (typeof output !== "string") output = util.inspect(output, {depth:0});

    await interaction.editReply({
        content: codeBlock('js', output)
    })
}