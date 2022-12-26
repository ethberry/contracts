import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

export default {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      gas: "auto",
      blockGasLimit: 40966424,
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
} as HardhatUserConfig;
