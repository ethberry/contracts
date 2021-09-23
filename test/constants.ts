import { ethers } from "hardhat";

export const baseTokenURI = "http://localhost/";

export const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
export const PAUSER_ROLE = ethers.utils.id("PAUSER_ROLE");
export const SNAPSHOT_ROLE = ethers.utils.id("SNAPSHOT_ROLE");

export const amount = 100;
export const initialTokenAmount = 100;
export const decimals = ethers.BigNumber.from(10).pow(18);
export const initialTokenAmountInWei = ethers.BigNumber.from(initialTokenAmount).mul(decimals);

export const proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
