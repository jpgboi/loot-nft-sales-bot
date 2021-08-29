import dotenv from 'dotenv'
import { BigNumber, Contract, Event, providers, utils } from 'ethers'
import fetch from 'node-fetch'
import abi from './abi.json'
import lootList from './loot.json'
import { CoinbaseData, Loot } from './types'

dotenv.config()

const rpc = new providers.JsonRpcProvider(process.env.PROVIDER_URL)
const contract = new Contract(process.env.CONTRACT_ADDRESS, abi, rpc)

async function main() {
  console.log('listening')

  contract.on(
    'Transfer',
    async (from: string, to: string, tokenId: BigNumber, event: Event) => {
      const { value } = await event.getTransaction()
      console.log({ from, to, tokenId, value })

      // make sure it was a sale and not just a transfer
      if (value.gte(0)) {
        const eth = utils.formatEther(value)
        const usd = (parseFloat(eth) * (await getEthUsd())).toLocaleString()
        const token = tokenId.toString()

        console.log(`Bag #${token}\nBought for ${eth} ETH ($${usd})`)

        const loot: Loot = lootList[token]
        console.log({ token, loot })
      }
    },
  )
}

const getEthUsd = async () => {
  const response = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy')
  const {
    data: { amount },
  }: CoinbaseData = await response.json()
  return parseInt(amount)
}

main()
