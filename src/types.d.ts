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

export interface Message {
  from: string
  to: string
  tokenId: string
  usd: string
  eth: string
  loot: Loot
}
