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
    async run({ interaction, options }) {

        const diceQuantityAdd = options.data.length > 0 ? options.data[0].value! : 0

        const { diceStringResult, diceOnlyNumber } = rollDice(Number(diceQuantityAdd), interaction.user)

        await interaction.reply({ content: diceStringResult })

        if (diceOnlyNumber == 4) {
            await interaction.followUp({ content: 'https://tenor.com/view/fireworks-firework-fourth-of-july-chinese-invention-celebrate-gif-8120832' })
        } else if (diceOnlyNumber == -4) {
            await interaction.followUp({ content: 'https://tenor.com/view/walter-white-falling-fast-gif-18043850' })
        }
    }
})
