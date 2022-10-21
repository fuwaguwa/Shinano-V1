import { ShinanoInteraction } from "../../../../typings/Command";
import { botHelpNSFW } from "./help-grp/nsfw";
import { botHelpSFW } from "./help-grp/sfw";

export async function botHelp(interaction: ShinanoInteraction) {
    switch (interaction.options.getString('command-type')) {
        case 'sfw': {
            await botHelpSFW(interaction)
            break
        }

        case 'nsfw': {
            await botHelpNSFW(interaction)
            break
        }
    }
}