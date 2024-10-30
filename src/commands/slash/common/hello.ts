import { ApplicationCommandType } from "discord.js";
import { Command } from "../../../structs/types/Command";

export default new Command({
    name: "hello",
    description: "Say hello",
    type: ApplicationCommandType.ChatInput,
    run({ interaction }) {
        interaction.reply({ content: `Hello ${interaction.member}` })
    }
})