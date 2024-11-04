import { User } from "discord.js"
import { randomIntFromInterval } from "./mathRandom"

function rollDice(quantityToAdd: number = 0, author: User) {

    const dicePossibilities = [0, 1, -1]
    const diceFormatString = ["0", "+", "-"]
    let totalDice = 0
    let stringDice = ""

    for (let i = 0; i < 4; i++) {
        const indexRandom = randomIntFromInterval(0, (dicePossibilities.length - 1))

        totalDice += dicePossibilities[indexRandom]
        stringDice = `${stringDice} ${diceFormatString[indexRandom]}`
    }

    totalDice += quantityToAdd

    return `[${stringDice.trim()}] ${quantityToAdd} = ${totalDice} (${author})`
}

export { rollDice }
