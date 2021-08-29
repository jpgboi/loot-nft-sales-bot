import dotenv from 'dotenv'
import { BigNumber, Contract, Event, providers } from 'ethers'
import abi from './abi.json'

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
    },
  )
}

main()
