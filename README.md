# Loot NFT Sales Bot

This bot sends sales data to [@lootproject](https://twitter.com/lootproject)'s [Discord server](https://t.co/GjVFrtNPnU?amp=1).

<br />

## Usage

1. Create an `.env` file and set the following secrets:

```sh
CONTRACT_ADDRESS= # Smart contract address (0x...)
PROVIDER_URL= # For example Alchemy or Infura URL
DISCORD_WEBHOOK_URL= # Discord Webhook URL (Server Settings -> Integrations -> Webhooks)
```

2. Install dependencies:

```
npm install
```

3. Run:

```
npm start
```

<br />

## How it works

This bot works by listening to the `Transfer` event on a smart contract.
This approach has the following advantages:

- provides a near real-time experience (events are emitted after a block is created)
- doesn't abuse the OpenSea API by periodically fetching it
- relying on a simple callback results in cleaner code

<br />

## Notes

- `abi.json` is from the [Loot Poject](https://etherscan.io/address/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7)
- `loot.json` & `rare.json` is from [dhof-loot](https://github.com/Anish-Agnihotri/dhof-loot/)

# Known Errors

```
/workspace/node_modules/@ethersproject/logger/src.ts/index.ts:225
        const error: any = new Error(message);
                           ^
Error: could not detect network (event="noNetwork", code=NETWORK_ERROR, version=providers/5.4.5)
```
