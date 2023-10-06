// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

// Gemunion
bytes32 constant METADATA_ROLE = keccak256("METADATA_ROLE");
// Polygon
bytes32 constant PREDICATE_ROLE = keccak256("PREDICATE_ROLE");
bytes32 constant DEPOSITOR_ROLE = keccak256("DEPOSITOR_ROLE");

// OpenZeppelin
// # Default
bytes32 constant DEFAULT_ADMIN_ROLE = 0x00;
// # Tokens
bytes32 constant MINTER_ROLE = keccak256("MINTER_ROLE");
bytes32 constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
// # Utils
bytes32 constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
// # Governance
bytes32 constant TIMELOCK_ADMIN_ROLE = keccak256("TIMELOCK_ADMIN_ROLE");
bytes32 constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
bytes32 constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
bytes32 constant CANCELLER_ROLE = keccak256("CANCELLER_ROLE");
