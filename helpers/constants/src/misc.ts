import { encodeBytes32String } from "ethers";

export const baseTokenURI = "http://localhost:3000/metadata"; // no trailing slash
export const tokenSymbol = "GEM";
export const tokenName = "GEMUNION";
export const tokenId = 1337n;
export const tokenMaxAmount = 2n;
export const batchSize = 5000n;
export const royalty = 100; // 1%
export const nonce = encodeBytes32String("nonce");

export const decimals = 18;
export const amount = 100000n;
export const span = 300;
