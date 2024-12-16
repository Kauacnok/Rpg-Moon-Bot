import { ColorResolvable, EmbedBuilder } from "discord.js";
import { CommandPrefix } from "../../../structs/CommandPrefix";
import { rollDice } from "../../../utils/rollDice";
import { config } from "../../..";

const roll = new CommandPrefix()

export default roll.createCommandPrefix({
    name: "roll",
    async run(message, args) {

        if (args.length > 0) {
            if (args[0] == undefined || args[0] == null || String(Number(args[0])) == "NaN") {
                const embedError = new EmbedBuilder()
                .setColor(config.colors.red as ColorResolvable)
                .setTitle("Error on roll command")
                .setDescription("Invalid first argument, must be a number.")

                await message.channel.send({ embeds: [embedError] })

                return
            }
        }

        const { diceStringResult, diceOnlyNumber } = rollDice(args.length > 0 ? Number(args[0]) : 0, message.author)

        await message.channel.send(diceStringResult)

        if (diceOnlyNumber == 4) {
            await message.channel.send('https://tenor.com/view/fireworks-firework-fourth-of-july-chinese-invention-celebrate-gif-8120832')
        } else if (diceOnlyNumber == -4) {
            await message.channel.send('https://tenor.com/view/walter-white-falling-fast-gif-18043850')
        }
    },
})
