import { ethers } from "hardhat";

export const baseTokenURI = "http://localhost:3000"; // no trailing slash
export const tokenSymbol = "SYMBOL";
export const tokenName = "Lorem ipsum...";
export const tokenId = 1;
export const royalty = 100; // 1%
export const nonce = ethers.utils.formatBytes32String("nonce");

export const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

export const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
export const PAUSER_ROLE = ethers.utils.id("PAUSER_ROLE");
export const SNAPSHOT_ROLE = ethers.utils.id("SNAPSHOT_ROLE");
export const PREDICATE_ROLE = ethers.utils.id("PREDICATE_ROLE");
export const DEPOSITOR_ROLE = ethers.utils.id("DEPOSITOR_ROLE");

export const decimals = ethers.BigNumber.from(10).pow(18);
export const amount = 100000;

// INTERFACES
export const accessControlInterfaceId = "0x7965db0b";
export const whiteListChildInterfaceId = "0x69906c17";

export enum InterfaceId {
  IERC165 = "0x01ffc9a7",
  IERC20 = "0x36372b07",
  IERC20Metadata = "0xa219a025",
  IERC998TDERC20 = "0x7294ffed",
  IERC998TDERC20Enumerable = "0xc5fd96cd",
  IERC998TD = "0xd8e93edb",
  IERC998TDEnumerable = "0xa344afe4",
  IERC998TDERC1155 = "0x7064387e",
  IERC998BU = "0xa1b23002",
  IERC998BUEnumerable = "0x8318b539",
  IERC998WL = "0x69906c17",
  IERC721 = "0x80ac58cd",
  IERC721Metadata = "0x5b5e139f",
  IERC721Enumerable = "0x780e9d63",
  IERC1155 = "0xd9b67a26",
  IERC1155Metadata = "0x0e89341c", // IERC1155MetadataURI
  IRoyalty = "0x2a55205a", // IERC2981
  IAccessControl = "0x7965db0b",
  Invalid = "0xffffffff",
}

export const addr = {
  hardhat: {
    openSeaProxyRegistry: "0xa5409ec958c83c3f309868babaca7c86dcb077c1",
    chainLinkVRFCoordinator: "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952",
    chainLinkToken: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    chainLinkFee: 2,
    chainLinkKeyHash: "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445",
  },
  mainnet: {
    openSeaProxyRegistry: "0xa5409ec958c83c3f309868babaca7c86dcb077c1",
    chainLinkVRFCoordinator: "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952",
    chainLinkToken: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    chainLinkFee: 2,
    chainLinkKeyHash: "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445",
  },
  rinkeby: {
    openSeaProxyRegistry: "0xf57b2c51ded3a29e6891aba85459d600256cf317",
    chainLinkVRFCoordinator: "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B",
    chainLinkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
    chainLinkFee: 0.1,
    chainLinkKeyHash: "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
  },
  mumbai: {
    childProxyManager: "0xb5505a6d998549090530911180f38aC5130101c6",
    chainLinkVRFCoordinator: "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255",
    chainLinkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    chainLinkFee: 0.0001,
    chainLinkKeyHash: "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4",
  },
  binancetest: {
    childProxyManager: "0xb5505a6d998549090530911180f38aC5130101c6",
    chainLinkVRFCoordinator: "0xa555fC018435bef5A13C6c6870a9d4C11DEC329C",
    chainLinkToken: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
    chainLinkFee: 0.1,
    chainLinkKeyHash: "0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186",
  },
  polygon: {
    childProxyManager: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
    chainLinkVRFCoordinator: "0x3d2341ADb2D31f1c5530cDC622016af293177AE0",
    chainLinkToken: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
    chainLinkFee: 0.0001,
    chainLinkKeyHash: "0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da",
  },
} as Record<string, any>;
