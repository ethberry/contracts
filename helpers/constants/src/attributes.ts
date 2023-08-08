import { toUtf8Bytes, zeroPadValue } from "ethers";

export const TEMPLATE_ID = zeroPadValue(toUtf8Bytes("TEMPLATE_ID"), 32);
export const RARITY = zeroPadValue(toUtf8Bytes("RARITY"), 32);
export const LEVEL = zeroPadValue(toUtf8Bytes("LEVEL"), 32);
export const GENES = zeroPadValue(toUtf8Bytes("GENES"), 32);
export const TRAITS = zeroPadValue(toUtf8Bytes("TRAITS"), 32);
