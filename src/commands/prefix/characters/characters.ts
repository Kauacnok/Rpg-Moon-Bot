import { ColorResolvable, EmbedBuilder } from "discord.js";
import { CommandPrefix } from "../../../structs/CommandPrefix";
import { config } from "../../..";
import { getCharacters } from "../../../api/getCharacters";

const characters = new CommandPrefix()

export default characters.createCommandPrefix({
    name: "characters",
    async run(message) {

        const characters = await getCharacters()

        if (characters.length == 0) {
            const embedError = new EmbedBuilder()
            .setTitle("Error on characters command")
            .setDescription("Characters not found")
            .setColor(config.colors.red as ColorResolvable)

            await message.channel.send({ embeds: [embedError] })

            return
        }

        let stringCharacters = ""

        for (let i = 0; i < characters.length; i++) {
            const character = characters[i]

            stringCharacters = `${stringCharacters}\n${character.name}`
        }

        const embedCharacter = new EmbedBuilder()
        .setTitle("Lista de personagens do Rpg Moon")
        .setColor(config.colors.blue as ColorResolvable)
        .setAuthor({ name: "Rpg Moon", iconURL: "https://i.imgur.com/kbQWAX2.jpg" })
        .setFields([{ name: "Personagens:", value: stringCharacters }])
        .setFooter({ text: `Informação requisitada por ${message.author.displayName}`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
        .setTimestamp()        

        await message.channel.send({ embeds: [embedCharacter] })
    },
})
