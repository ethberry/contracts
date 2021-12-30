import { ethers } from "hardhat";

export const baseTokenURI = "http://localhost/";
export const tokenSymbol = "SYMBOL";
export const tokenName = "Lorem ipsum...";

export const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
export const PAUSER_ROLE = ethers.utils.id("PAUSER_ROLE");
export const SNAPSHOT_ROLE = ethers.utils.id("SNAPSHOT_ROLE");

export const TEST_DATA = "0x00000000000000000000000000000000000000000000000000000000686f6c61";
export const ZERO_ADDR = "0x0000000000000000000000000000000000000000";
export const DEAD_ADDR = "0x000000000000000000000000000000000000dead";

export const decimals = ethers.BigNumber.from(10).pow(18);
export const amount = 100;
export const amountInWei = ethers.BigNumber.from(amount).mul(decimals);
export const initialTokenAmount = 1000;
export const initialTokenAmountInWei = ethers.BigNumber.from(initialTokenAmount).mul(decimals);
export const erc20cap = ethers.BigNumber.from("2000000000").mul(decimals);
