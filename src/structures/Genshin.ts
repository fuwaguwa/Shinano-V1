import genshin from 'genshin-db'
import { Element } from '../typings/Genshin'

const stars = (item: genshin.Character | genshin.Weapon) => {return "⭐".repeat(parseInt(item.rarity, 10))}
const color = (char: genshin.Character, elementColors: Element) => {return elementColors[char.element]}
const icon = (char: genshin.Character, elementIcons: Element) => {return elementIcons[char.element]}


export {stars, color, icon}