import dotenv from 'dotenv'
import { ICharacter } from '../structs/types/api/ICharacter'
dotenv.config()

export async function getCharacterByName(name: string) {

    const response = await fetch(`${process.env.RPG_MOON_API}/character/${name}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    }).then(async (value) => {
        const data = await value.json() as ICharacter

        if (value.status != 200) {
            return null
        }

        return data 
    }).catch(() => {
        return null
    }) 

    return response
}
