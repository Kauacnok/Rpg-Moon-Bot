import dotenv from 'dotenv'
import { IGetCharacters } from '../structs/types/api/IGetCharacters'
dotenv.config()

export async function getCharacters() {

    const response = await fetch(`${process.env.RPG_MOON_API}/getCharacters`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    }).then(async (value) => {
        const data = await value.json() as IGetCharacters[]

        if (value.status != 200) {
            return []
        }

        return data
    }).catch(() => {
        return []
    }) 

    return response
}
