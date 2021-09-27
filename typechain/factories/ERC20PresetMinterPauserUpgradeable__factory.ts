/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ERC20PresetMinterPauserUpgradeable,
  ERC20PresetMinterPauserUpgradeableInterface,
} from "../ERC20PresetMinterPauserUpgradeable";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PAUSER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleMemberCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506122ac806100206000396000f3fe608060405234801561001057600080fd5b50600436106101cf5760003560e01c80635c975abb11610104578063a217fddf116100a2578063d539139311610071578063d5391393146103f4578063d547741f1461041b578063dd62ed3e1461042e578063e63ab1e91461046757600080fd5b8063a217fddf146103b3578063a457c2d7146103bb578063a9059cbb146103ce578063ca15c873146103e157600080fd5b80638456cb59116100de5780638456cb591461033f5780639010d07c1461034757806391d148541461037257806395d89b41146103ab57600080fd5b80635c975abb146102f757806370a082311461030357806379cc67901461032c57600080fd5b8063313ce567116101715780633f4ba83a1161014b5780633f4ba83a146102b657806340c10f19146102be57806342966c68146102d15780634cd88b76146102e457600080fd5b8063313ce5671461028157806336568abe1461029057806339509351146102a357600080fd5b806318160ddd116101ad57806318160ddd1461022457806323b872dd14610236578063248a9ca3146102495780632f2ff15d1461026c57600080fd5b806301ffc9a7146101d457806306fdde03146101fc578063095ea7b314610211575b600080fd5b6101e76101e2366004612041565b61048e565b60405190151581526020015b60405180910390f35b6102046104d2565b6040516101f3919061214b565b6101e761021f366004611fbd565b610564565b60cb545b6040519081526020016101f3565b6101e7610244366004611f82565b61057a565b610228610257366004611fe6565b60009081526065602052604090206001015490565b61027f61027a366004611ffe565b61063e565b005b604051601281526020016101f3565b61027f61029e366004611ffe565b610665565b6101e76102b1366004611fbd565b610687565b61027f6106c3565b61027f6102cc366004611fbd565b610769565b61027f6102df366004611fe6565b610813565b61027f6102f2366004612069565b610820565b61012d5460ff166101e7565b610228610311366004611f36565b6001600160a01b0316600090815260c9602052604090205490565b61027f61033a366004611fbd565b6108de565b61027f610978565b61035a610355366004612020565b610a1c565b6040516001600160a01b0390911681526020016101f3565b6101e7610380366004611ffe565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b610204610a3b565b610228600081565b6101e76103c9366004611fbd565b610a4a565b6101e76103dc366004611fbd565b610afb565b6102286103ef366004611fe6565b610b08565b6102287f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b61027f610429366004611ffe565b610b1f565b61022861043c366004611f50565b6001600160a01b03918216600090815260ca6020908152604080832093909416825291909152205490565b6102287f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b60006001600160e01b031982167f5a05180f0000000000000000000000000000000000000000000000000000000014806104cc57506104cc82610b29565b92915050565b606060cc80546104e19061220f565b80601f016020809104026020016040519081016040528092919081815260200182805461050d9061220f565b801561055a5780601f1061052f5761010080835404028352916020019161055a565b820191906000526020600020905b81548152906001019060200180831161053d57829003601f168201915b5050505050905090565b6000610571338484610b90565b50600192915050565b6000610587848484610ce8565b6001600160a01b038416600090815260ca60209081526040808320338452909152902054828110156106265760405162461bcd60e51b815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206160448201527f6c6c6f77616e636500000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6106338533858403610b90565b506001949350505050565b6106488282610f0c565b60008281526097602052604090206106609082610f32565b505050565b61066f8282610f47565b60008281526097602052604090206106609082610fcf565b33600081815260ca602090815260408083206001600160a01b038716845290915281205490916105719185906106be90869061217e565b610b90565b6106ed7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33610380565b61075f5760405162461bcd60e51b815260206004820152603960248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f76652070617573657220726f6c6520746f20756e706175736500000000000000606482015260840161061d565b610767610fe4565b565b6107937f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633610380565b6108055760405162461bcd60e51b815260206004820152603660248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f7665206d696e74657220726f6c6520746f206d696e7400000000000000000000606482015260840161061d565b61080f8282611082565b5050565b61081d338261116d565b50565b600054610100900460ff1680610839575060005460ff16155b61089c5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161061d565b600054610100900460ff161580156108be576000805461ffff19166101011790555b6108c883836112fe565b8015610660576000805461ff0019169055505050565b60006108ea833361043c565b9050818110156109615760405162461bcd60e51b8152602060048201526024808201527f45524332303a206275726e20616d6f756e74206578636565647320616c6c6f7760448201527f616e636500000000000000000000000000000000000000000000000000000000606482015260840161061d565b61096e8333848403610b90565b610660838361116d565b6109a27f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33610380565b610a145760405162461bcd60e51b815260206004820152603760248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f76652070617573657220726f6c6520746f207061757365000000000000000000606482015260840161061d565b6107676113e8565b6000828152609760205260408120610a349083611472565b9392505050565b606060cd80546104e19061220f565b33600090815260ca602090815260408083206001600160a01b038616845290915281205482811015610ae45760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f000000000000000000000000000000000000000000000000000000606482015260840161061d565b610af13385858403610b90565b5060019392505050565b6000610571338484610ce8565b60008181526097602052604081206104cc9061147e565b61066f8282611488565b60006001600160e01b031982167f7965db0b0000000000000000000000000000000000000000000000000000000014806104cc57507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b03198316146104cc565b6001600160a01b038316610c0b5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f7265737300000000000000000000000000000000000000000000000000000000606482015260840161061d565b6001600160a01b038216610c875760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f7373000000000000000000000000000000000000000000000000000000000000606482015260840161061d565b6001600160a01b03838116600081815260ca602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b038316610d645760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f6472657373000000000000000000000000000000000000000000000000000000606482015260840161061d565b6001600160a01b038216610de05760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f6573730000000000000000000000000000000000000000000000000000000000606482015260840161061d565b610deb8383836114ae565b6001600160a01b038316600090815260c9602052604090205481811015610e7a5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e63650000000000000000000000000000000000000000000000000000606482015260840161061d565b6001600160a01b03808516600090815260c96020526040808220858503905591851681529081208054849290610eb190849061217e565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610efd91815260200190565b60405180910390a35b50505050565b600082815260656020526040902060010154610f2881336114b9565b6106608383611539565b6000610a34836001600160a01b0384166115db565b6001600160a01b0381163314610fc55760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c660000000000000000000000000000000000606482015260840161061d565b61080f828261162a565b6000610a34836001600160a01b0384166116ad565b61012d5460ff166110375760405162461bcd60e51b815260206004820152601460248201527f5061757361626c653a206e6f7420706175736564000000000000000000000000604482015260640161061d565b61012d805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b0382166110d85760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161061d565b6110e4600083836114ae565b8060cb60008282546110f6919061217e565b90915550506001600160a01b038216600090815260c960205260408120805483929061112390849061217e565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b0382166111e95760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f7300000000000000000000000000000000000000000000000000000000000000606482015260840161061d565b6111f5826000836114ae565b6001600160a01b038216600090815260c96020526040902054818110156112845760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f6365000000000000000000000000000000000000000000000000000000000000606482015260840161061d565b6001600160a01b038316600090815260c960205260408120838303905560cb80548492906112b39084906121b5565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b600054610100900460ff1680611317575060005460ff16155b61137a5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161061d565b600054610100900460ff1615801561139c576000805461ffff19166101011790555b6113a46117ca565b6113ac6117ca565b6113b46117ca565b6113bc6117ca565b6113c6838361187c565b6113ce6117ca565b6113d6611958565b6113de6117ca565b6108c88383611a15565b61012d5460ff161561143c5760405162461bcd60e51b815260206004820152601060248201527f5061757361626c653a2070617573656400000000000000000000000000000000604482015260640161061d565b61012d805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586110653390565b6000610a348383611b12565b60006104cc825490565b6000828152606560205260409020600101546114a481336114b9565b610660838361162a565b610660838383611b4a565b60008281526065602090815260408083206001600160a01b038516845290915290205460ff1661080f576114f7816001600160a01b03166014611bc4565b611502836020611bc4565b6040516020016115139291906120ca565b60408051601f198184030181529082905262461bcd60e51b825261061d9160040161214b565b60008281526065602090815260408083206001600160a01b038516845290915290205460ff1661080f5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556115973390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000818152600183016020526040812054611622575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556104cc565b5060006104cc565b60008281526065602090815260408083206001600160a01b038516845290915290205460ff161561080f5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600081815260018301602052604081205480156117c05760006116d16001836121b5565b85549091506000906116e5906001906121b5565b905081811461176657600086600001828154811061171357634e487b7160e01b600052603260045260246000fd5b906000526020600020015490508087600001848154811061174457634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255918252600188019052604090208390555b855486908061178557634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506104cc565b60009150506104cc565b600054610100900460ff16806117e3575060005460ff16155b6118465760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161061d565b600054610100900460ff16158015611868576000805461ffff19166101011790555b801561081d576000805461ff001916905550565b600054610100900460ff1680611895575060005460ff16155b6118f85760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161061d565b600054610100900460ff1615801561191a576000805461ffff19166101011790555b825161192d9060cc906020860190611dfa565b5081516119419060cd906020850190611dfa565b508015610660576000805461ff0019169055505050565b600054610100900460ff1680611971575060005460ff16155b6119d45760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161061d565b600054610100900460ff161580156119f6576000805461ffff19166101011790555b61012d805460ff19169055801561081d576000805461ff001916905550565b600054610100900460ff1680611a2e575060005460ff16155b611a915760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161061d565b600054610100900460ff16158015611ab3576000805461ffff19166101011790555b611abe600033611deb565b611ae87f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633611deb565b6108c87f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33611deb565b6000826000018281548110611b3757634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b61012d5460ff16156106605760405162461bcd60e51b815260206004820152602a60248201527f45524332305061757361626c653a20746f6b656e207472616e7366657220776860448201527f696c652070617573656400000000000000000000000000000000000000000000606482015260840161061d565b60606000611bd3836002612196565b611bde90600261217e565b67ffffffffffffffff811115611c0457634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611c2e576020820181803683370190505b5090507f300000000000000000000000000000000000000000000000000000000000000081600081518110611c7357634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053507f780000000000000000000000000000000000000000000000000000000000000081600181518110611ccc57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000611cf0846002612196565b611cfb90600161217e565b90505b6001811115611d9c577f303132333435363738396162636465660000000000000000000000000000000085600f1660108110611d4a57634e487b7160e01b600052603260045260246000fd5b1a60f81b828281518110611d6e57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c93611d95816121f8565b9050611cfe565b508315610a345760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161061d565b610648828261080f8282611539565b828054611e069061220f565b90600052602060002090601f016020900481019282611e285760008555611e6e565b82601f10611e4157805160ff1916838001178555611e6e565b82800160010185558215611e6e579182015b82811115611e6e578251825591602001919060010190611e53565b50611e7a929150611e7e565b5090565b5b80821115611e7a5760008155600101611e7f565b80356001600160a01b0381168114611eaa57600080fd5b919050565b600082601f830112611ebf578081fd5b813567ffffffffffffffff80821115611eda57611eda612260565b604051601f8301601f19908116603f01168101908282118183101715611f0257611f02612260565b81604052838152866020858801011115611f1a578485fd5b8360208701602083013792830160200193909352509392505050565b600060208284031215611f47578081fd5b610a3482611e93565b60008060408385031215611f62578081fd5b611f6b83611e93565b9150611f7960208401611e93565b90509250929050565b600080600060608486031215611f96578081fd5b611f9f84611e93565b9250611fad60208501611e93565b9150604084013590509250925092565b60008060408385031215611fcf578182fd5b611fd883611e93565b946020939093013593505050565b600060208284031215611ff7578081fd5b5035919050565b60008060408385031215612010578182fd5b82359150611f7960208401611e93565b60008060408385031215612032578182fd5b50508035926020909101359150565b600060208284031215612052578081fd5b81356001600160e01b031981168114610a34578182fd5b6000806040838503121561207b578182fd5b823567ffffffffffffffff80821115612092578384fd5b61209e86838701611eaf565b935060208501359150808211156120b3578283fd5b506120c085828601611eaf565b9150509250929050565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516121028160178501602088016121cc565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000601791840191820152835161213f8160288401602088016121cc565b01602801949350505050565b602081526000825180602084015261216a8160408501602087016121cc565b601f01601f19169190910160400192915050565b600082198211156121915761219161224a565b500190565b60008160001904831182151516156121b0576121b061224a565b500290565b6000828210156121c7576121c761224a565b500390565b60005b838110156121e75781810151838201526020016121cf565b83811115610f065750506000910152565b6000816122075761220761224a565b506000190190565b600181811c9082168061222357607f821691505b6020821081141561224457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfea2646970667358221220e3b5317466f15c60f8e799453cbcc1567773d99c3b22377af7c32886771f599064736f6c63430008040033";

export class ERC20PresetMinterPauserUpgradeable__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ERC20PresetMinterPauserUpgradeable> {
    return super.deploy(overrides || {}) as Promise<ERC20PresetMinterPauserUpgradeable>;
  }
  getDeployTransaction(overrides?: Overrides & { from?: string | Promise<string> }): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ERC20PresetMinterPauserUpgradeable {
    return super.attach(address) as ERC20PresetMinterPauserUpgradeable;
  }
  connect(signer: Signer): ERC20PresetMinterPauserUpgradeable__factory {
    return super.connect(signer) as ERC20PresetMinterPauserUpgradeable__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC20PresetMinterPauserUpgradeableInterface {
    return new utils.Interface(_abi) as ERC20PresetMinterPauserUpgradeableInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ERC20PresetMinterPauserUpgradeable {
    return new Contract(address, _abi, signerOrProvider) as ERC20PresetMinterPauserUpgradeable;
  }
}