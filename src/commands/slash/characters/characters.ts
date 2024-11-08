import { ApplicationCommandType, ColorResolvable, EmbedBuilder } from "discord.js";
import { Command } from "../../../structs/types/Command";
import { getCharacters } from "../../../api/getCharacters";
import { config } from "../../..";

export default new Command({
    name: "characters",
    description: "Lista de personagens do Rpg Moon",
    type: ApplicationCommandType.ChatInput,
    async run({ interaction }) {

        const characters = await getCharacters()

        if (characters.length == 0) {
            const embedError = new EmbedBuilder()
            .setTitle("Error on characters command")
            .setDescription("Characters not found")
            .setColor(config.colors.red as ColorResolvable)

            await interaction.reply({ embeds: [embedError] })

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
        .setFooter({ text: `Informação requisitada por ${interaction.user.displayName}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg` })
        .setTimestamp()        

        await interaction.deferReply()

        await interaction.editReply({ embeds: [embedCharacter] })
    }
})
