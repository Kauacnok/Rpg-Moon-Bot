import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, ComponentType, EmbedBuilder } from "discord.js";
import { CommandPrefix } from "../../../structs/CommandPrefix";
import { config } from "../../..";
import { getCharacterByName } from "../../../api/getCharacterByName";
import { ICharacter } from "../../../structs/types/api/ICharacter";
import { updateCharacterPage } from "../../../utils/updateCharacterEmbed";

const character = new CommandPrefix()

export default character.createCommandPrefix({
    name: "character",
    async run(message, args) {

        if (args.length == 0) {
            const embedError = new EmbedBuilder()
            .setTitle("Error on character command")
            .setDescription("First argument cannot be empty")
            .setColor(config.colors.red as ColorResolvable)

            await message.channel.send({ embeds: [embedError] })

            return
        }

        const character: ICharacter | null = await getCharacterByName(args[0].toLowerCase().trim())

        if (character == null) {
            const embedError = new EmbedBuilder()
            .setTitle("Error on character command")
            .setDescription("Character not found")
            .setColor(config.colors.red as ColorResolvable)

            await message.channel.send({ embeds: [embedError] })

            return
        }

        let page = 1

        const embedCharacter = new EmbedBuilder()
        .setTitle(`${character.name} (${character.player})`)
        .setDescription(`${character.characterDescription}\nPontos: ${character.points}\nXP: ${character.xp}\nXP Gasto: ${character.xpSpent}\nNível: ${character.level}`)
        .setColor(config.colors.blue as ColorResolvable)
        .setThumbnail(character.avatarURL)
        .setAuthor({ name: "RPG Moon", iconURL: "https://i.imgur.com/kbQWAX2.jpg" })
        .setFields([
            { name: "Atributos:", value: `Força: ${character.force}\nAgilidade: ${character.agility}\nResistência: ${character.resistance}\nInteligência: ${character.inteligence}\nPercepção: ${character.perception}\nVontade: ${character.disposal}\nCarisma: ${character.charisma}` },
            { name: "Habilidades:", value: character.skills}
        ])
        .setFooter({ text: `Informação requisitada por ${message.author.displayName}`, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg` })
        .setTimestamp()

        const buttons: ButtonBuilder[] = []
        const texts = ["Voltar", "Próximo"]

        for (let i = 0; i < 2; i++) {
            const button = new ButtonBuilder()
            .setCustomId(`option${i}`)
            .setLabel(texts[i])
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(i == 0 ? true : false)

            buttons.push(button)
        }

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(...buttons)

        const response = await message.channel.send({ embeds: [embedCharacter], components: [row], options: { fetchReply: true } })

        try {
            const collector = await response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600_000 })

            collector.on('collect', async buttonInteraction => {
                if (buttonInteraction.user.id !== message.author.id) {
                    return
                }
                
                if (buttonInteraction.customId == "option0") {
                    page -= 1

                    const result = updateCharacterPage(character, page, row, embedCharacter, { displayName: message.author.displayName, id: message.author.id, avatar: message.author.avatar })

                    await buttonInteraction.update({ embeds: [result.embed], components: [result.row] })
                } else if (buttonInteraction.customId == "option1") {
                    page += 1

                    const result = updateCharacterPage(character, page, row, embedCharacter, { displayName: message.author.displayName, id: message.author.id, avatar: message.author.avatar })

                    await buttonInteraction.update({ embeds: [result.embed], components: [result.row] })
                }
            })
            
        } catch (error) {
            await response.edit({ content: 'Tempo de interação esgotado', components: [] });
        }
    },
})
