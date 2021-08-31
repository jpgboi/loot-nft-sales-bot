const dotenv = require('dotenv')
dotenv.config() // make sure this is called first

import { BigNumber, Contract, Event, providers, utils } from 'ethers'
import fetch from 'node-fetch'
import abi from './abi.json'
import { sendDiscordMessage } from './discord'
import lootList from './loot.json'
import { CoinbaseData, Loot, Message } from './types'

if (!process.env.PROVIDER_URL) {
  throw new Error('Missing `PROVIDER_URL`')
}

if (!process.env.CONTRACT_ADDRESS) {
  throw new Error('Missing `CONTRACT_ADDRESS`')
}

const rpc = new providers.JsonRpcProvider(process.env.PROVIDER_URL)
const contract = new Contract(process.env.CONTRACT_ADDRESS, abi, rpc)

async function main() {
  console.log('🚀 Listening for sales...')

  contract.on(
    'Transfer',
    async (from: string, to: string, tokenIdBN: BigNumber, event: Event) => {
      const { value } = await event.getTransaction()

      // make sure it was a sale and not just a transfer
      // by checking if value is greater than 0
      if (value.gt(0)) {
        const tokenId = tokenIdBN.toString()
        const loot: Loot = lootList[tokenId]

        // get prices
        const eth = utils.formatEther(value)
        const usd = await getEthUsd(parseFloat(eth))

        const message: Message = {
          from,
          to,
          tokenId,
          eth,
          usd,
          loot,
        }
        console.log('Sale: ', message)
        sendDiscordMessage(message)
      }
    },
  )
}

const getEthUsd = async (eth: number) => {
  const response = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy')
  const {
    data: { amount },
  }: CoinbaseData = await response.json()
  return (eth * parseInt(amount)).toLocaleString()
}

;(async () => {
  try {
    await main()
  } catch (e) {
    console.log(e)
    process.exit(-1)
  }
  process.exit()
})()
