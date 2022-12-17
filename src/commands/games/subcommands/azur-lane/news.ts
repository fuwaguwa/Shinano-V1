import { ShinanoInteraction } from "../../../../typings/Command";
import { azurLaneNewsStart } from "./news-grp/start";
import { azurLaneNewsStop } from "./news-grp/stop";

export async function azurLaneNews(interaction: ShinanoInteraction) {
    switch (interaction.options.getSubcommand()) {
        case 'start': {
            await azurLaneNewsStart(interaction)
            break
        }

        case 'stop': {
            await azurLaneNewsStop(interaction)
            break
        }
    }
}