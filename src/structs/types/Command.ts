import { ApplicationCommandData, ButtonInteraction, Collection, CommandInteraction, CommandInteractionOptionResolver, Message, ModalSubmitInteraction, OmitPartialGroupDMChannel, StringSelectMenuInteraction } from "discord.js";
import { ExtendedClient } from "../ExtendedClient";

interface CommandProps {
    client: ExtendedClient,
    interaction: CommandInteraction,
    options: CommandInteractionOptionResolver
}

export type ComponentsButton = Collection<string, (interaction: ButtonInteraction) => any>
export type ComponentsSelect = Collection<string, (interaction: StringSelectMenuInteraction) => any>
export type ComponentsModal = Collection<string, (interaction: ModalSubmitInteraction) => any>

interface CommandComponents {
    buttons?: ComponentsButton
    selects?: ComponentsSelect
    modals?: ComponentsModal
}

export type CommandType = ApplicationCommandData & CommandComponents & {
    run(props: CommandProps): any
}

export type CommandTypePrefix = {
    name: string
    run: (message: OmitPartialGroupDMChannel<Message<boolean>>, args: string[]) => any
}

export class Command {
    constructor(options: CommandType) {
        options.dmPermission = false
        Object.assign(this, options)
    }
}
