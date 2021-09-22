# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
hardhat accounts
hardhat balance --account 0x

node scripts/sample-script.ts
```


https://docs.openzeppelin.com/contracts/4.x/wizard
https://docs.matic.network/docs/develop/ethereum-matic/mintable-assets/#contract-to-be-deployed-on-ethereum
https://github.com/wighawag/hardhat-deploy

https://ethereum.stackexchange.com/questions/15641/how-does-a-contract-find-out-if-another-address-is-a-contract
https://medium.com/coinmonks/hardhat-configuration-c96415d4fcba

#deploy to besu hyperledger network

run docker command:

docker run -p 8546:8546 --mount type=bind,source=/Users/ubudragon/javascript/GEMUNIONSTUDIO/contracts/besu/testnode,target=/var/lib/besu hyperledger/besu:latest --miner-enabled --miner-coinbase fe3b557e8fb62b89f4916b721be55ceb828dbd73 --rpc-ws-enabled --network=dev --data-path=/var/lib/besu