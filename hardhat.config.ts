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
    polygon: {
      url: process.env.RPC_URL_POLYGON,
    },
  },
  solidity: {
    version: "0.8.4",
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
