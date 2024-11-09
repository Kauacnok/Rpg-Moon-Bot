import { ActionRowBuilder, ButtonBuilder, ColorResolvable, EmbedBuilder, Message, OmitPartialGroupDMChannel } from "discord.js"
import { ICharacter } from "../structs/types/api/ICharacter"
import { config } from ".."

interface IAuthorObject {
    displayName: string
    id: string
    avatar: string
}

function updateCharacterPage(character: ICharacter, page: number, row: ActionRowBuilder<ButtonBuilder>, embedDefault: EmbedBuilder, authorObject: IAuthorObject) {

    switch(page) {
        case 1:
            row.components[0].setDisabled(true)

            return { embed: embedDefault, row }
        case 2:
            row.components[0].setDisabled(false)
            row.components[1].setDisabled(false)

            const embedCharacter = new EmbedBuilder()
            .setTitle(`${character.name} (${character.player})`)
            .setDescription(`${character.characterDescription}\nPontos: ${character.points}\nXP: ${character.xp}\nXP Gasto: ${character.xpSpent}\nNível: ${character.level}`)
            .setColor(config.colors.blue as ColorResolvable)
            .setThumbnail(character.avatarURL)
            .setAuthor({ name: "RPG Moon", iconURL: "https://i.imgur.com/kbQWAX2.jpg" })
            .setFields([
                { name: "Características do personagem:", value: `Caminho: ${character.route}\nOrigem: ${character.origin}\nPersonalidade: ${character.personality}\nMotivação: ${character.motivation}\nConexão: ${character.connection}\nProblema: ${character.problem}` },
                { name: "Desgaste:", value: `Físico ${character.physical}\nMental: ${character.psychological}` }
            ])
            .setFooter({ text: `Informação requisitada por ${authorObject.displayName}`, iconURL: `https://cdn.discordapp.com/avatars/${authorObject.id}/${authorObject.avatar}.jpeg` })
            .setTimestamp()

            return { embed: embedCharacter, row}
        case 3:
            row.components[1].setDisabled(true)

            const embedCharacterInventory = new EmbedBuilder()
            .setTitle(`${character.name} (${character.player})`)
            .setDescription(`${character.characterDescription}\nPontos: ${character.points}\nXP: ${character.xp}\nXP Gasto: ${character.xpSpent}\nNível: ${character.level}`)
            .setColor(config.colors.blue as ColorResolvable)
            .setThumbnail(character.avatarURL)
            .setAuthor({ name: "RPG Moon", iconURL: "https://i.imgur.com/kbQWAX2.jpg" })
            .setFields([
                { name: "Inventário:", value: `${character.inventory}` },
                { name: "Dinheiro:", value: `${character.money}` }
            ])
            .setFooter({ text: `Informação requisitada por ${authorObject.displayName}`, iconURL: `https://cdn.discordapp.com/avatars/${authorObject.id}/${authorObject.avatar}.jpeg` })
            .setTimestamp()

            return { embed: embedCharacterInventory, row }
        default:
            const embedError = new EmbedBuilder()
            .setTitle("test")

            return { embed: embedError, row }
    }
}

export { updateCharacterPage }
