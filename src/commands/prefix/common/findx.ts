import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { CommandPrefix } from "../../../structs/CommandPrefix";
import { randomIntFromInterval } from "../../../utils/mathRandom";

const findx = new CommandPrefix()

export default findx.createCommandPrefix({
    name: "findx",
    async run(message) {

        const buttons: ButtonBuilder[] = []
        const options = ["option0", "option1", "option2"]
        const optionSort = options[randomIntFromInterval(0, (options.length - 1))]

        for (let i = 0; i < 3; i++) {
            const button = new ButtonBuilder()
            .setCustomId(`option${i}`)
            .setLabel(`Opção ${i + 1}`)
            .setStyle(ButtonStyle.Secondary)

            buttons.push(button)
        }

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(...buttons)

        const response = await message.channel.send({
            content: "Encontre o X",
            components: [row]
        })

        try {
            const confirmation = await response.awaitMessageComponent({ time: 300_000 })

            if (confirmation.user.id !== message.author.id) {
                return
            }

            for (let i = 0; i < 3; i++) {
                row.components[i].setDisabled(true)
                row.components[i].setLabel(`option${i}` == optionSort ? "X" : "O")
            }

            for (let i = 0; i < 3; i++) {
                if (confirmation.customId == options[i]) {
                    if (options[i] == optionSort) {
                        await confirmation.update({ components: [row] })
                        await message.channel.send(`${confirmation.user} acertou!`)

                        return
                    } else {
                        await confirmation.update({ components: [row] })
                        await message.channel.send(`${confirmation.user} errou!`)

                        return
                    }
                }
            }
        } catch (error) {
            await response.edit({ content: 'Tempo de interação esgotado', components: [] });
        }
    },
})
