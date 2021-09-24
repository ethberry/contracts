import { ethers } from "hardhat";

export const baseTokenURI = "http://localhost/";

export const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
export const PAUSER_ROLE = ethers.utils.id("PAUSER_ROLE");
export const SNAPSHOT_ROLE = ethers.utils.id("SNAPSHOT_ROLE");
export const DEPOSITOR_ROLE = ethers.utils.id("DEPOSITOR_ROLE");

export const amount = 100;
export const initialTokenAmount = 100;
export const decimals = ethers.BigNumber.from(10).pow(18);
export const initialTokenAmountInWei = ethers.BigNumber.from(initialTokenAmount).mul(decimals);

export const childProxyManagerMumbai = "0xb5505a6d998549090530911180f38aC5130101c6";
export const childProxyManagerPolygon = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";
