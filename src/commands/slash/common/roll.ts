import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../../structs/types/Command";
import { rollDice } from "../../../utils/rollDice";

export default new Command({
    name: "roll",
    description: "Role um dado 4df",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "quantity",
            description: "Adicione uma quantidade adicional na rolagem de dados",
            type: ApplicationCommandOptionType.Number,
            required: false
        }
    ],
    run({ interaction, options }) {

        const diceQuantityAdd = options.data.length > 0 ? options.data[0].value! : 0

        const dice = rollDice(Number(diceQuantityAdd), interaction.user)

        interaction.reply({ content: dice })
    }
})
