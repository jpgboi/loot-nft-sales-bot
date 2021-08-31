import {
  MessageAttachment,
  WebhookClient,
  WebhookMessageOptions,
} from 'discord.js'
import { imageRarityFromItems } from 'loot-rarity'
import svg2img from 'svg2img'

import { Message } from './types'

const url = process.env.DISCORD_WEBHOOK_URL

if (!url) {
  throw new Error('Missing `DISCORD_WEBHOOK_URL`')
}

const webhookClient = new WebhookClient({ url })

function shortenAddress(address: string) {
  return address.slice(0, 6) + '…' + address.slice(-4)
}

function tweakSvgColors(svg) {
  return svg.replace(/#838383/g, '#c0c0c0')
}

// Discord doesn’t support data URI nor SVG files,
// so we need to convert the data URI SVG into a PNG buffer.
async function rarityImageBuffer(items: string[]): Promise<Buffer> {
  const dataUriImage = imageRarityFromItems(items)
  const svg = tweakSvgColors(decodeURIComponent(dataUriImage).split(',')[1])
  return new Promise((resolve, reject) => {
    svg2img(svg, { width: 1000, height: 1000 }, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

export const sendDiscordMessage = async ({
  eth,
  from,
  loot,
  to,
  tokenId,
  usd,
}: Message) => {
  const attachment = new MessageAttachment(
    await rarityImageBuffer([
      loot.weapon,
      loot.chest,
      loot.head,
      loot.waist,
      loot.foot,
      loot.hand,
      loot.neck,
      loot.ring,
    ]),
    'loot.png',
  )

  const message: WebhookMessageOptions = {
    username: 'Loot Market',
    avatarURL:
      'https://pbs.twimg.com/profile_images/1431587138202701826/lpgblc4h_400x400.jpg',
    embeds: [
      {
        title: `Bag #${tokenId}`,
        url: `https://opensea.io/assets/${process.env.CONTRACT_ADDRESS}/${tokenId}`,
        color: 0x000000,
        description: `**Bought for ${eth} ETH ($${usd})**`,
        image: { url: 'attachment://loot.png' },
        footer: {
          text: `💰 by ${shortenAddress(to)} from ${shortenAddress(from)}`,
        },
      },
    ],
    files: [attachment],
  }

  webhookClient.send(message).catch((error) => {
    console.error('Error while sending Discord message', error)
  })
}
