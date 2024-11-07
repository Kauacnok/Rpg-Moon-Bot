import { ColorResolvable, EmbedBuilder } from "discord.js";
import { CommandPrefix } from "../../../structs/CommandPrefix";
import { config } from "../../..";

const say = new CommandPrefix()

export default say.createCommandPrefix({
    name: "say",
    async run(message, args) {

        if (args.length == 0) {
            const embed = new EmbedBuilder()
            .setColor(config.colors.red as ColorResolvable)
            .setTitle("Error on say command")
            .setDescription("Invalid first argument cannot be empty")

            await message.channel.send({ embeds: [embed] })

            return
        }

        await message.delete()

        await message.channel.send(args.join(' '))
    },
})
