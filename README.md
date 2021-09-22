# Hardhat manual
### Install Hardhat
```shell
npm i
```
### Compile contracts
```shell
hardhat compile
```
### Run contracts tests
```shell
hardhat test
```
### Run Hardhat's test Node
```shell
hardhat test
```

# Deploy to Test BlockChains
Use appropriate deploy script for each contract

## HardHat Node
```shell
hardhat run --network localhost scripts/deploy_erc20.ts
```
## Besu Hyperledger
1. Run besu network in docker
(note: change absolute path to store local besu files)
```shell
docker run -p 8546:8546 --mount type=bind, \
source=<absolute local path>,target=/var/lib/besu \ 
hyperledger/besu:latest --miner-enabled --miner-coinbase \ 
fe3b557e8fb62b89f4916b721be55ceb828dbd73 --rpc-ws-enabled --network=dev \
--data-path=/var/lib/besu
```
2. Deploy contract to Besu node
```shell
hardhat run --network besu scripts/deploy_erc20.ts
```

## Ropsten test network
1. Get a faucet ETH :
 - Visit [https://faucet.ropsten.be/](https://faucet.ropsten.be/)
 - Enter your metamask wallet address and wait for ETH airdrop
2. Get an Alchemy API key (App's dashboard)
3. Get yor Metamask private key
4. Set both keys in hardhat.config.ts (as ALCHEMY_API_KEY and ROPSTEN_PRIVATE_KEY)
5. Deploy contract to Ropsten
```shell
hardhat run --network ropsten scripts/deploy_erc20.ts
```