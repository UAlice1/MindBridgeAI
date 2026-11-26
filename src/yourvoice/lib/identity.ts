// UI preview only. In production the server issues the account and stores only a salted hash of the code.
const words = ['Inyange', 'Umucyo', 'Ihumure', 'Amahoro', 'Ikizere', 'Urumuri']
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 32 symbols, so the modulo below is unbiased

const bytes = (n: number) => crypto.getRandomValues(new Uint8Array(n))
const symbols = (b: Uint8Array) => Array.from(b, x => alphabet[x % 32]).join('')

export const newAlias = () => `${words[bytes(1)[0] % words.length]}-${symbols(bytes(4))}`

export const newRecoveryCode = () => symbols(bytes(20)).replace(/(.{5})(?=.)/g, '$1-')
