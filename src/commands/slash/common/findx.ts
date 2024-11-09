import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../../../structs/types/Command";
import { randomIntFromInterval } from "../../../utils/mathRandom";

export default new Command({
    name: "findx",
    description: "Encontre o X entre os botões",
    type: ApplicationCommandType.ChatInput,
    async run({ interaction }) {
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

        const response = await interaction.reply({ content: "Encontre o X", components: [row], fetchReply: true })

        try {
            const collector = await response.createMessageComponentCollector({ time: 300_000 })

            collector.on("collect", async buttonInteraction => {
                if (buttonInteraction.user.id !== interaction.user.id) {
                    return
                }

                for (let i = 0; i < 3; i++) {
                    row.components[i].setDisabled(true)
                    row.components[i].setLabel(`option${i}` == optionSort ? "X" : "O")
                }

                for (let i = 0; i < 3; i++) {
                    if (buttonInteraction.customId == options[i]) {
                        if (options[i] == optionSort) {
                            await buttonInteraction.update({ components: [row] })
                            await buttonInteraction.followUp(`${buttonInteraction.user} acertou!`)

                            return
                        } else {
                            await buttonInteraction.update({ components: [row] })
                            await buttonInteraction.followUp(`${buttonInteraction.user} errou!`)

                            return
                        }
                    }
                }
            })

        } catch(error) {
            await response.edit({ content: "Tempo de interação encerrado", components: [] } )
        }
    },
})
