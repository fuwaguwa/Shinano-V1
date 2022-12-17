import { ShinanoInteraction } from "../../../../typings/Command";
import { azurLaneNewsSet } from "./news-grp/set";
import { azurLaneNewsStop } from "./news-grp/stop";

export async function azurLaneNews(interaction: ShinanoInteraction) {
    switch (interaction.options.getSubcommand()) {
        case 'set': {
            await azurLaneNewsSet(interaction)
            break
        }

        case 'stop': {
            await azurLaneNewsStop(interaction)
            break
        }
    }
}