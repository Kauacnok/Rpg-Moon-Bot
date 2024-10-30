import { Message, OmitPartialGroupDMChannel } from "discord.js"

class CommandPrefix  {
    createCommandPrefix({ name, run }: { name: string, run: (message: OmitPartialGroupDMChannel<Message<boolean>>, args: string[]) => any }) {
        return {
            name,
            run
        }
    }
}

export { CommandPrefix }