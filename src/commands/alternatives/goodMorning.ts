import fs from 'fs'
import path from 'path'
import { IGoodMorning } from '../../structs/types/generics/IGoodMorning'
import { Message, OmitPartialGroupDMChannel } from 'discord.js'
import { randomIntFromInterval } from '../../utils/mathRandom'

async function goodMorningMessage(message: OmitPartialGroupDMChannel<Message<boolean>>) {

    const pathGoodMorningJson = path.join(__dirname, "../../..")
    const fileGoodMorningJson = fs.readFileSync(`${pathGoodMorningJson}/goodMorning.json`, "utf-8")
    const arrayGoodMorning: IGoodMorning []= JSON.parse(fileGoodMorningJson)

    const messageSorted = arrayGoodMorning[randomIntFromInterval(0, (arrayGoodMorning.length - 1))]

    await message.channel.send(`Bom dia ${message.author}, ${messageSorted.message}`)

    if (messageSorted.haveAttachment) {
        await message.channel.send(messageSorted.attachment)
    }
}

export { goodMorningMessage }
