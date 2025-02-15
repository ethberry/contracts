import { config } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

config();

export default {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      gas: "auto",
      blockGasLimit: 40966424,
    },
    besu: {
      url: process.env.JSON_RPC_ADDR_BESU,
      // https://besu.hyperledger.org/en/stable/Reference/Accounts-for-Testing/
      accounts: [
        "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63", // 0xfe3b557e8fb62b89f4916b721be55ceb828dbd73
        "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3", // 0x627306090abaB3A6e1400e9345bC60c78a8BEf57
        "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f", // 0xf17f52151EbEF6C7334FAD080c5704D77216b732
      ],
    },
    polygon: {
      url: process.env.JSON_RPC_ADDR_POLYGON,
    },
    mumbai: {
      url: process.env.JSON_RPC_ADDR_MUMBAI,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 8000000000, // default is 'auto' which breaks chains without the london hardfork
      timeout: 142000,
      // gas: 29999915,
    },
    binancetest: {
      url: process.env.JSON_RPC_ADDR_BINANCE_TEST,
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY],
    },
    binancemain: {
      url: process.env.JSON_RPC_ADDR_BINANCE,
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.20",
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
