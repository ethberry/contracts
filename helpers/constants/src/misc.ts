import { encodeBytes32String, id, ZeroHash } from "ethers";

export const baseTokenURI = "http://localhost:3000/metadata"; // no trailing slash
export const tokenSymbol = "GEM";
export const tokenName = "GEMUNION";
export const tokenId = 1337;
export const tokenMaxAmount = 2;
export const batchSize = 5000;
export const royalty = 100; // 1%
export const nonce = encodeBytes32String("nonce");

export const DEFAULT_ADMIN_ROLE = ZeroHash;

export const MINTER_ROLE = id("MINTER_ROLE");
export const PAUSER_ROLE = id("PAUSER_ROLE");
export const SNAPSHOT_ROLE = id("SNAPSHOT_ROLE");
export const PREDICATE_ROLE = id("PREDICATE_ROLE");
export const DEPOSITOR_ROLE = id("DEPOSITOR_ROLE");
export const METADATA_ROLE = id("METADATA_ROLE");

export const TEMPLATE_ID = id("TEMPLATE_ID");

export const decimals = 18;
export const amount = 100000n;
export const span = 300;
