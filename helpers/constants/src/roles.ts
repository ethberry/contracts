import { id, ZeroHash } from "ethers";

// Gemunion
export const METADATA_ROLE = id("METADATA_ROLE");

// Polygon
export const PREDICATE_ROLE = id("PREDICATE_ROLE");
export const DEPOSITOR_ROLE = id("DEPOSITOR_ROLE");

// OpenZeppelin
// # Default
export const DEFAULT_ADMIN_ROLE = ZeroHash;
// # Tokens
export const MINTER_ROLE = id("MINTER_ROLE");
export const SNAPSHOT_ROLE = id("SNAPSHOT_ROLE");
// # Utils
export const PAUSER_ROLE = id("PAUSER_ROLE");
// # Governance
export const TIMELOCK_ADMIN_ROLE = id("TIMELOCK_ADMIN_ROLE");
export const PROPOSER_ROLE = id("PROPOSER_ROLE");
export const EXECUTOR_ROLE = id("EXECUTOR_ROLE");
export const CANCELLER_ROLE = id("CANCELLER_ROLE");
