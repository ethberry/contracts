import { encodeBytes32String, id, toUtf8Bytes, ZeroHash, zeroPadValue } from "ethers";

export const baseTokenURI = "http://localhost:3000/metadata"; // no trailing slash
export const tokenSymbol = "GEM";
export const tokenName = "GEMUNION";
export const tokenId = 1337n;
export const tokenMaxAmount = 2n;
export const batchSize = 5000n;
export const royalty = 100; // 1%
export const nonce = encodeBytes32String("nonce");

export const DEFAULT_ADMIN_ROLE = ZeroHash;

export const MINTER_ROLE = id("MINTER_ROLE");
export const PAUSER_ROLE = id("PAUSER_ROLE");
export const SNAPSHOT_ROLE = id("SNAPSHOT_ROLE");
export const PREDICATE_ROLE = id("PREDICATE_ROLE");
export const DEPOSITOR_ROLE = id("DEPOSITOR_ROLE");
export const METADATA_ROLE = id("METADATA_ROLE");

export const TEMPLATE_ID = zeroPadValue(toUtf8Bytes("TEMPLATE_ID"), 32);
export const RARITY = zeroPadValue(toUtf8Bytes("RARITY"), 32);
export const LEVEL = zeroPadValue(toUtf8Bytes("LEVEL"), 32);

export const decimals = 18;
export const amount = 100000n;
export const span = 300;
