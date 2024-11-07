import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../../structs/types/Command";

export default new Command({
    name: "say",
    description: "Faça o bot digitar uma mensage",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "message",
            description: "Digite a mensagem do bot",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    async run({ interaction, options }) {
        const message = String(options.data[0].value)

        await interaction.reply({ content: message })
    }
})
