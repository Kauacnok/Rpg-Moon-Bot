import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, ColorResolvable, ComponentType, EmbedBuilder } from "discord.js";
import { Command } from "../../../structs/types/Command";
import { ICharacter } from "../../../structs/types/api/ICharacter";
import { getCharacterByName } from "../../../api/getCharacterByName";
import { config } from "../../..";
import { updateCharacterPage } from "../../../utils/updateCharacterEmbed";

export default new Command({
    name: "character",
    description: "Ficha de um personagem em específico",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "character",
            description: "Digite o primeiro nome do personagem",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    async run({ interaction, options }) {
        const characterName = String(options.data[0].value!).toLowerCase().trim()

        const character: ICharacter | null = await getCharacterByName(characterName)
       
        if (character == null) {
            const embedError = new EmbedBuilder()
            .setTitle("Error on character command")
            .setDescription("Character not found")
            .setColor(config.colors.red as ColorResolvable)

            await interaction.reply({ embeds: [embedError] })

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
        .setFooter({ text: `Informação requisitada por ${interaction.user.displayName}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg` })
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

        await interaction.deferReply({ fetchReply: true })

        const response = await interaction.followUp({ embeds: [embedCharacter], components: [row], options: { fetchReply: true } })

        try {
            const collector = await response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600_000 })

            collector.on('collect', async buttonInteraction => {
                if (buttonInteraction.user.id !== interaction.user.id) {
                    return
                }
                
                if (buttonInteraction.customId == "option0") {
                    page -= 1

                    const result = updateCharacterPage(character, page, row, embedCharacter, { displayName: interaction.user.displayName, id: interaction.user.id, avatar: interaction.user.avatar })

                    await buttonInteraction.update({ embeds: [result.embed], components: [result.row] })
                } else if (buttonInteraction.customId == "option1") {
                    page += 1

                    const result = updateCharacterPage(character, page, row, embedCharacter, { displayName: interaction.user.displayName, id: interaction.user.id, avatar: interaction.user.avatar })

                    await buttonInteraction.update({ embeds: [result.embed], components: [result.row] })
                }
            })
            
        } catch (error) {
            await response.edit({ content: 'Tempo de interação esgotado', components: [] });
        }

    }
})
