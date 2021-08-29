import { WebhookClient } from 'discord.js'
import { Message } from './types'

const url = process.env.DISCORD_WEBHOOK_URL

if (!url) {
  throw new Error('No `DISCORD_WEBHOOK_URL` provided')
}

const webhookClient = new WebhookClient({ url })

export const sendDiscordMessage = async ({ tokenId, eth, usd }: Message) => {
  webhookClient
    .send(`Bag #${tokenId}\nBought for ${eth} ETH ($${usd})`)
    .catch((error) => {
      console.error('Error while sending Discord message', error)
    })
}
