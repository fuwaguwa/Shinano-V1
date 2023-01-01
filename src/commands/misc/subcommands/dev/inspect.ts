import { ShinanoInteraction } from "../../../../typings/Command";
import { devInspectGuild } from "./inspect-grp/guild";
import { devInspectUser } from "./inspect-grp/user";

export async function devInspect(interaction: ShinanoInteraction) {
    switch (interaction.options.getSubcommand()) {
        case 'user': {
            await devInspectUser(interaction)
            break
        }

        case 'guild': {
            await devInspectGuild(interaction)
            break
        }
    }
}