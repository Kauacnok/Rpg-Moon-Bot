import { Message, OmitPartialGroupDMChannel } from "discord.js";

async function rulesMessage(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    await message.channel.send("<:No_:820316608324960256>")
}

export { rulesMessage }