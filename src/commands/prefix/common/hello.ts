import { CommandPrefix } from "../../../structs/CommandPrefix"

const helloCommand = new CommandPrefix()

export default helloCommand.createCommandPrefix({
    name: "hello",
    run: async (message) => {
        await message.channel.send(`Hello ${message.author}`)
    }
})
