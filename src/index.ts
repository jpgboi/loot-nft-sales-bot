const dotenv = require('dotenv')
dotenv.config() // make sure this is called first

import { BigNumber, Contract, Event, providers, utils } from 'ethers'
import fetch from 'node-fetch'
import abi from './abi.json'
import erc20abi from './erc20abi.json'
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
  return new Promise((_, reject) => {
    try {
      console.log('🚀 Listening for sales...')
      contract.on(
        'Transfer',
        async (
          from: string,
          to: string,
          tokenIdBN: BigNumber,
          event: Event,
        ) => {
          const { value: tValue } = await event.getTransaction()
          const value = tValue.gt(0)
            ? tValue
            : await getWethTransfer(await event.getTransactionReceipt())

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
    } catch (err) {
      reject(err)
    }
  })
}

const getEthUsd = async (eth: number) => {
  const response = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy')
  const {
    data: { amount },
  }: CoinbaseData = await response.json()
  return (eth * parseInt(amount)).toLocaleString()
}

const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

// try to extract weth transfer from logs
// example txs: https://etherscan.io/tx/0xd7efc5e28f495234815c79848e73265e92b5dbfed50e7127719cd19a9046fa08
const getWethTransfer = async (
  receipt: providers.TransactionReceipt,
): Promise<BigNumber> => {
  try {
    const { from, to, logs } = receipt
    const iface = new utils.Interface(erc20abi)
    let amount = BigNumber.from(0)
    for (const log of logs) {
      // only WETH support for now
      if (log.address === WETH) {
        const transaction = iface.parseLog(log)
        const [f, t, value] = transaction.args

        // only look for the seller -> buyer txs
        // (ignore additional fee split transfers)
        if (from == t) amount = value
      }
    }
    // console.log(transfers)
    return amount
  } catch (error) {
    return BigNumber.from(0)
  }
}

;(async function run() {
  try {
    await main()
  } catch (e) {
    console.error('Error in main', e)
    console.log('Restarting...')
    run()
  }
})()
