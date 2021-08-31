const dotenv = require('dotenv')
dotenv.config() // make sure this is called first

import { sendDiscordMessage } from './discord'

if (!process.env.PROVIDER_URL) {
  throw new Error('Missing `PROVIDER_URL`')
}

if (!process.env.CONTRACT_ADDRESS) {
  throw new Error('Missing `CONTRACT_ADDRESS`')
}

sendDiscordMessage({
  from: '0x39432039ddBd6fC67668386C897e54c1c5554CE4',
  to: '0xf480935955D38A332CF40c65adD722D46b922462',
  tokenId: '5326',
  eth: '3.9',
  usd: '13,400.4',
  loot: {
    chest: '"Gloom Bender" Ring Mail of Anger +1',
    foot: '"Demon Shout" Demonhide Boots of Protection +1',
    hand: "Demon's Hands",
    head: 'Cap',
    neck: 'Amulet',
    ring: 'Gold Ring',
    waist: 'Demonhide Belt',
    weapon: 'Maul',
  },
})

sendDiscordMessage({
  from: '0xd8C5b21d28101E482c68B54d0D5ED62D9C3B824d',
  to: '0xE72EB31b59F85b19499A0F3b3260011894FA0d65',
  tokenId: '1579',
  eth: '5.0',
  usd: '16,950',
  loot: {
    chest: 'Linen Robe',
    foot: '"Victory Grasp" Shoes of Brilliance +1',
    hand: '"Havoc Whisper" Ornate Gauntlets of Fury',
    head: 'Linen Hood',
    neck: 'Amulet',
    ring: 'Titanium Ring',
    waist: '"Kraken Grasp" Hard Leather Belt of the Twins +1',
    weapon: 'Long Sword',
  },
})
