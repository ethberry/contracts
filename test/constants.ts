import { ethers } from "hardhat";

// export const baseTokenURI = "http://localhost/";
export const baseTokenURI = "https://us-central1-encoder-memoryos.cloudfunctions.net/LociMetadataJson/";

export const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
export const PAUSER_ROLE = ethers.utils.id("PAUSER_ROLE");
export const SNAPSHOT_ROLE = ethers.utils.id("SNAPSHOT_ROLE");
export const DEPOSITOR_ROLE = ethers.utils.id("DEPOSITOR_ROLE");

export const decimals = ethers.BigNumber.from(10).pow(18);
export const amount = 100;
export const amountInWei = ethers.BigNumber.from(amount).mul(decimals);
export const initialTokenAmount = 2 * 1e3;
export const initialTokenAmountInWei = ethers.BigNumber.from(initialTokenAmount).mul(decimals);
export const cap = ethers.BigNumber.from("2000000000").mul(decimals);

export const addr = {
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
  polygon: {
    childProxyManager: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
    chainLinkVRFCoordinator: "0x3d2341ADb2D31f1c5530cDC622016af293177AE0",
    chainLinkToken: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
    chainLinkFee: 0.0001,
    chainLinkKeyHash: "0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da",
  },
} as Record<string, any>;

// rinkeby Link deployed to: 0xc643120D54a9E0252D8B09189905E2C073d331BC
// mumbai  Link deployed to: 0x7d8CE7aB7109c13d2c47518e49e811f0DA012516
