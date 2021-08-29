export interface Loot {
  chest: string
  foot: string
  hand: string
  head: string
  neck: string
  ring: string
  waist: string
  weapon: string
}

export interface CoinbaseData {
  data: {
    base: string
    currency: string
    amount: string
  }
}
