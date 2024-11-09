import { ApplicationCommandDataResolvable, BitFieldResolvable, Client, ClientEvents, Collection, GatewayIntentsString, IntentsBitField, Message, OmitPartialGroupDMChannel, Partials } from "discord.js";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { goodMorningMessage } from "../commands/alternatives/goodMorning";
import { CommandType, CommandTypePrefix, ComponentsButton, ComponentsModal, ComponentsSelect } from "./types/Command";
import { EventType } from "./types/Event";
import { rulesMessage } from "../commands/alternatives/rules";
const fileCondition = (fileName: string) => fileName.endsWith(".ts") || fileName.endsWith(".js")

export class ExtendedClient extends Client {
	public commands: Collection<string, CommandType> = new Collection()
	public buttons: ComponentsButton = new Collection()
	public selects: ComponentsSelect = new Collection()
	public modals: ComponentsModal = new Collection()
	prefixesCommands: CommandTypePrefix[]

	constructor() {
		super({
			intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<GatewayIntentsString, number>,
			partials: [
				Partials.Channel, 
				Partials.GuildMember,
				Partials.GuildScheduledEvent,
				Partials.Message,
				Partials.Reaction,
				Partials.ThreadMember,
				Partials.User
			]
		})
		this.prefixesCommands = []
	}

	public start() {
		this.registerPrefixesCommands()
		this.registerModules()
		this.registerEvents()
		this.login(process.env.BOT_TOKEN)
	}

	private registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
		this.application?.commands.set(commands)
		.then(() => {
			console.log("Slash Commands (/) defined".green)
		})
		.catch((error) => {
			console.log(`An error ocurred while trying to set the Slash Commands (/):\n${error}`.red)
		}) 
	}

	private registerModules() {
		const slashCommands: Array<ApplicationCommandDataResolvable> = []

		const commandsPath = path.join(__dirname, "..", "commands/slash")

		fs.readdirSync(commandsPath).forEach(local => {

			fs.readdirSync(commandsPath + `/${local}/`).filter(fileCondition).forEach(async (fileName) => {
				
				const command: CommandType = (await import(`../commands/slash/${local}/${fileName}`))?.default
				const { name, buttons, selects, modals } = command

				if (name) {
					this.commands.set(name, command)

					slashCommands.push(command)

					if (buttons) {
						buttons.forEach((run, key) => this.buttons.set(key, run))
					}

					if (selects) {
						selects.forEach((run, key) => this.selects.set(key, run))
					}

					if (modals) {
						modals.forEach((run, key) => this.modals.set(key, run))
					}
				}

			})
		})

		this.on("ready", () => this.registerCommands(slashCommands))
		this.on("messageCreate", (message) => this.callPrefixCommands(message))
	}

	private registerEvents() {
		const eventsPath = path.join(__dirname, "..", "events")

		fs.readdirSync(eventsPath).forEach(local => {
		
			fs.readdirSync(`${eventsPath}/${local}`).filter(fileCondition)
			.forEach(async fileName => {
				const { name, once, run }: EventType<keyof ClientEvents> = (await import(`../events/${local}/${fileName}`))?.default

				try {

					if (name) {
						if (!once) {
							this.on(name, run)

							return
						}

						this.once(name, run)
					}

				} catch(error) {
					console.log(`An error ocurred on event: ${name}\n${error}`.red)
				}
			})

		})
	}

	private registerPrefixesCommands() {
		const commandsPath = path.join(__dirname, "..", "commands/prefix")

		fs.readdirSync(commandsPath).forEach(local => {

			fs.readdirSync(commandsPath + `/${local}/`).filter(fileCondition).forEach(async (fileName, index) => {
				
				const command: CommandTypePrefix = (await import(`../commands/prefix/${local}/${fileName}`))?.default

				this.prefixesCommands.push(command)

				const pathCommands = path.join(__dirname, "../../")

				if (fs.existsSync(`${pathCommands}/commands.json`)) {
					fs.writeFileSync(`${pathCommands}/commands.json`, JSON.stringify({ data: this.prefixesCommands }), { flag: "w" })
				}
			})
		})
	}

	private async callPrefixCommands(message: OmitPartialGroupDMChannel<Message<boolean>>) {

		if (message.content.toLocaleLowerCase() == "bom dia grupo") {

			await goodMorningMessage(message)

			return
		}

		if (message.content.toLocaleLowerCase() == "!regras") {
			await rulesMessage(message)

			return
		}

		if (!message.guild) return
		if (message.author.bot) return
		if (!message.content.startsWith(process.env.PREFIX!)) return

		const command = message.content.toLocaleLowerCase().split(" ")[0].slice(process.env.PREFIX!.length)
		const args = message.content.split(" ").slice(1)

		const isCommandExist = this.prefixesCommands.filter((commandPrefix) => commandPrefix.name == command)

		if (isCommandExist.length > 0) {
			isCommandExist[0].run(message, args)
		} else {
			console.log(`Error: Command ${command} not found`.red)
		}

	}
}