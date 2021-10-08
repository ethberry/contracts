# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
hardhat accounts
hardhat balance --account 0x

node scripts/sample-script.ts
```

## inheritance and calls graph
surya inheritance -i contracts/ERC721/ERC721TradableUpgradeable.sol | dot -Tpng > graph/ERC721TradableUpgradeable.png
surya graph contracts/ERC721/ERC721TradableUpgradeable.sol | dot -Tpng > graph/ERC721TradableUpgradeable.png