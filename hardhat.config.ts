import { config } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";

import "./tasks";

config();

export default {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY as string}`,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_MUMBAI as string}`,
      // url: `http://127.0.0.1:8545`,
      accounts: [process.env.MM_PRIVATEKEY],
      gasPrice: 8000000000, // default is 'auto' which breaks chains without the london hardfork
      // gas: 29999915,
    },
    // ropsten: {
    //   url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    //   accounts: [`0x${process.env.ROPSTEN_PRIVATE_KEY as string}`],
    // },
    besu: {
      url: `http://127.0.0.1:8545`,
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY as string}`,
      gas: 29999915,
      gasPrice: 8000000000,
      timeout: 42000,
      // accounts: [process.env.MM_PRIVATEKEY],
      accounts: {
        mnemonic: process.env.MM_MNEMONIC,
      },
      saveDeployments: true,
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 21,
  },
} as HardhatUserConfig;
