/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Dex, DexInterface } from "../Dex";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Bought",
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
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "PayeeAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentReleased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Sold",
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
    name: "acceptedToken",
    outputs: [
      {
        internalType: "contract IERC20Upgradeable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_acceptedToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_priceOracle",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_payees",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_shares",
        type: "uint256[]",
      },
    ],
    name: "initialize",
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
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "payee",
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
    inputs: [],
    name: "priceOracle",
    outputs: [
      {
        internalType: "contract IPriceOracle",
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
        internalType: "address payable",
        name: "account",
        type: "address",
      },
    ],
    name: "release",
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
    ],
    name: "released",
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
        name: "amountOfToken",
        type: "uint256",
      },
    ],
    name: "sell",
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
    ],
    name: "shares",
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
    inputs: [],
    name: "totalReleased",
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
    inputs: [],
    name: "totalShares",
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
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50612b2c806100206000396000f3fe6080604052600436106100ab5760003560e01c80639852595c116100645780639852595c14610209578063a6f2ae3a14610246578063ce7c2ac214610250578063e33b7de31461028d578063e4849b32146102b8578063ed3c6694146102e1576100f2565b806319165587146100f75780632630c12f146101205780633a98ef391461014b578063451c3d80146101765780635c975abb146101a15780638b83209b146101cc576100f2565b366100f2577f6ef95f06320e7a25a04a175ca677b7052bdd97131872c2192525a629f51be7706100d961030a565b346040516100e8929190611fc6565b60405180910390a1005b600080fd5b34801561010357600080fd5b5061011e60048036038101906101199190611ae3565b610312565b005b34801561012c57600080fd5b5061013561057a565b6040516101429190612025565b60405180910390f35b34801561015757600080fd5b506101606105a0565b60405161016d9190612280565b60405180910390f35b34801561018257600080fd5b5061018b6105aa565b604051610198919061200a565b60405180910390f35b3480156101ad57600080fd5b506101b66105d0565b6040516101c39190611fef565b60405180910390f35b3480156101d857600080fd5b506101f360048036038101906101ee9190611bc8565b6105e7565b6040516102009190611f22565b60405180910390f35b34801561021557600080fd5b50610230600480360381019061022b9190611aba565b610655565b60405161023d9190612280565b60405180910390f35b61024e61069e565b005b34801561025c57600080fd5b5061027760048036038101906102729190611aba565b6109f8565b6040516102849190612280565b60405180910390f35b34801561029957600080fd5b506102a2610a41565b6040516102af9190612280565b60405180910390f35b3480156102c457600080fd5b506102df60048036038101906102da9190611bc8565b610a4b565b005b3480156102ed57600080fd5b5061030860048036038101906103039190611b0c565b610dae565b005b600033905090565b6000606760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411610394576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161038b906120a0565b60405180910390fd5b6000606654476103a49190612334565b90506000606860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054606554606760008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548461043691906123bb565b610440919061238a565b61044a9190612415565b90506000811415610490576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161048790612100565b60405180910390fd5b80606860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546104db9190612334565b606860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508060665461052c9190612334565b60668190555061053c8382610fdb565b7fdf20fd1e76bc69d672e4814fafb2c449bba3a5369d8359adf9e05e6fde87b056838260405161056d929190611f3d565b60405180910390a1505050565b609860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000606554905090565b609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000603360009054906101000a900460ff16905090565b600060698281548110610623577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b6000606860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6106a66105d0565b156106e6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106dd90612140565b60405180910390fd5b60003411610729576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161072090612200565b60405180910390fd5b60006107d634609860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633c8da5886040518163ffffffff1660e01b8152600401602060405180830381600087803b15801561079957600080fd5b505af11580156107ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107d19190611bf1565b6110cf565b90506000811161081b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161081290612080565b60405180910390fd5b6000609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016108789190611f22565b60206040518083038186803b15801561089057600080fd5b505afa1580156108a4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108c89190611bf1565b90508082111561090d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610904906121e0565b60405180910390fd5b609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33846040518363ffffffff1660e01b815260040161096a929190611fc6565b602060405180830381600087803b15801561098457600080fd5b505af1158015610998573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109bc9190611b9f565b507f4e08ba899977cf7d4c2964bce71c6b9a7ef76ee5166a4c1249a1e08016e33ef1826040516109ec9190612280565b60405180910390a15050565b6000606760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000606654905090565b610a536105d0565b15610a93576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a8a90612140565b60405180910390fd5b60008111610ad6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610acd90612120565b60405180910390fd5b6000609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e33306040518363ffffffff1660e01b8152600401610b35929190611f66565b60206040518083038186803b158015610b4d57600080fd5b505afa158015610b61573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b859190611bf1565b905081811015610bca576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bc190612160565b60405180910390fd5b6000610c7783609860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633c8da5886040518163ffffffff1660e01b8152600401602060405180830381600087803b158015610c3a57600080fd5b505af1158015610c4e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c729190611bf1565b6110ec565b9050609760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330866040518463ffffffff1660e01b8152600401610cd893929190611f8f565b602060405180830381600087803b158015610cf257600080fd5b505af1158015610d06573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d2a9190611b9f565b503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610d71573d6000803e3d6000fd5b507f92f64ca637d023f354075a4be751b169c1a8a9ccb6d33cdd0cb352054399572783604051610da19190612280565b60405180910390a1505050565b600060019054906101000a900460ff1680610dd4575060008054906101000a900460ff16155b610e13576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e0a90612180565b60405180910390fd5b60008060019054906101000a900460ff161590508015610e63576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b610e6b611109565b610e7583836111f2565b610e948573ffffffffffffffffffffffffffffffffffffffff166112df565b610ed3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610eca90612040565b60405180910390fd5b84609760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610f338473ffffffffffffffffffffffffffffffffffffffff166112df565b610f72576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f6990612220565b60405180910390fd5b83609860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508015610fd45760008060016101000a81548160ff0219169083151502179055505b5050505050565b8047101561101e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611015906120e0565b60405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff168260405161104490611f0d565b60006040518083038185875af1925050503d8060008114611081576040519150601f19603f3d011682016040523d82523d6000602084013e611086565b606091505b50509050806110ca576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110c1906120c0565b60405180910390fd5b505050565b60006110e482846112f290919063ffffffff16565b905092915050565b6000611101828461130890919063ffffffff16565b905092915050565b600060019054906101000a900460ff168061112f575060008054906101000a900460ff16155b61116e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161116590612180565b60405180910390fd5b60008060019054906101000a900460ff1615905080156111be576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6111c661131e565b6111ce6113f7565b80156111ef5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680611218575060008054906101000a900460ff16155b611257576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161124e90612180565b60405180910390fd5b60008060019054906101000a900460ff1615905080156112a7576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6112af61131e565b6112b983836114eb565b80156112da5760008060016101000a81548160ff0219169083151502179055505b505050565b600080823b905060008111915050919050565b60008183611300919061238a565b905092915050565b6000818361131691906123bb565b905092915050565b600060019054906101000a900460ff1680611344575060008054906101000a900460ff16155b611383576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161137a90612180565b60405180910390fd5b60008060019054906101000a900460ff1615905080156113d3576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b80156113f45760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff168061141d575060008054906101000a900460ff16155b61145c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161145390612180565b60405180910390fd5b60008060019054906101000a900460ff1615905080156114ac576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6000603360006101000a81548160ff02191690831515021790555080156114e85760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680611511575060008054906101000a900460ff16155b611550576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161154790612180565b60405180910390fd5b60008060019054906101000a900460ff1615905080156115a0576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b81518351146115e4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115db906121a0565b60405180910390fd5b6000835111611628576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161161f90612240565b60405180910390fd5b60005b83518110156116d1576116be848281518110611670577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101518483815181106116b1577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101516116f8565b80806116c990612552565b91505061162b565b5080156116f35760008060016101000a81548160ff0219169083151502179055505b505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611768576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161175f90612060565b60405180910390fd5b600081116117ab576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016117a290612260565b60405180910390fd5b6000606760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541461182d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611824906121c0565b60405180910390fd5b6069829080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080606760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806065546118e29190612334565b6065819055507f40c340f65e17194d14ddddb073d3c9f888e3cb52b5aae0c6c7706b4fbc905fac8282604051611919929190611fc6565b60405180910390a15050565b6000611938611933846122c0565b61229b565b9050808382526020820190508285602086028201111561195757600080fd5b60005b85811015611987578161196d88826119fd565b84526020840193506020830192505060018101905061195a565b5050509392505050565b60006119a461199f846122ec565b61229b565b905080838252602082019050828560208602820111156119c357600080fd5b60005b858110156119f357816119d98882611a90565b8452602084019350602083019250506001810190506119c6565b5050509392505050565b600081359050611a0c81612a9a565b92915050565b600081359050611a2181612ab1565b92915050565b600082601f830112611a3857600080fd5b8135611a48848260208601611925565b91505092915050565b600082601f830112611a6257600080fd5b8135611a72848260208601611991565b91505092915050565b600081519050611a8a81612ac8565b92915050565b600081359050611a9f81612adf565b92915050565b600081519050611ab481612adf565b92915050565b600060208284031215611acc57600080fd5b6000611ada848285016119fd565b91505092915050565b600060208284031215611af557600080fd5b6000611b0384828501611a12565b91505092915050565b60008060008060808587031215611b2257600080fd5b6000611b30878288016119fd565b9450506020611b41878288016119fd565b935050604085013567ffffffffffffffff811115611b5e57600080fd5b611b6a87828801611a27565b925050606085013567ffffffffffffffff811115611b8757600080fd5b611b9387828801611a51565b91505092959194509250565b600060208284031215611bb157600080fd5b6000611bbf84828501611a7b565b91505092915050565b600060208284031215611bda57600080fd5b6000611be884828501611a90565b91505092915050565b600060208284031215611c0357600080fd5b6000611c1184828501611aa5565b91505092915050565b611c23816124a3565b82525050565b611c3281612449565b82525050565b611c418161246d565b82525050565b611c50816124b5565b82525050565b611c5f816124d9565b82525050565b6000611c72603683612323565b9150611c7d82612639565b604082019050919050565b6000611c95602c83612323565b9150611ca082612688565b604082019050919050565b6000611cb8602083612323565b9150611cc3826126d7565b602082019050919050565b6000611cdb602683612323565b9150611ce682612700565b604082019050919050565b6000611cfe603a83612323565b9150611d098261274f565b604082019050919050565b6000611d21601d83612323565b9150611d2c8261279e565b602082019050919050565b6000611d44602b83612323565b9150611d4f826127c7565b604082019050919050565b6000611d67602583612323565b9150611d7282612816565b604082019050919050565b6000611d8a601083612323565b9150611d9582612865565b602082019050919050565b6000611dad601983612323565b9150611db88261288e565b602082019050919050565b6000611dd0602e83612323565b9150611ddb826128b7565b604082019050919050565b6000611df3603283612323565b9150611dfe82612906565b604082019050919050565b6000611e16600083612318565b9150611e2182612955565b600082019050919050565b6000611e39602b83612323565b9150611e4482612958565b604082019050919050565b6000611e5c602083612323565b9150611e67826129a7565b602082019050919050565b6000611e7f601b83612323565b9150611e8a826129d0565b602082019050919050565b6000611ea2602683612323565b9150611ead826129f9565b604082019050919050565b6000611ec5601a83612323565b9150611ed082612a48565b602082019050919050565b6000611ee8601d83612323565b9150611ef382612a71565b602082019050919050565b611f0781612499565b82525050565b6000611f1882611e09565b9150819050919050565b6000602082019050611f376000830184611c29565b92915050565b6000604082019050611f526000830185611c1a565b611f5f6020830184611efe565b9392505050565b6000604082019050611f7b6000830185611c29565b611f886020830184611c29565b9392505050565b6000606082019050611fa46000830186611c29565b611fb16020830185611c29565b611fbe6040830184611efe565b949350505050565b6000604082019050611fdb6000830185611c29565b611fe86020830184611efe565b9392505050565b60006020820190506120046000830184611c38565b92915050565b600060208201905061201f6000830184611c47565b92915050565b600060208201905061203a6000830184611c56565b92915050565b6000602082019050818103600083015261205981611c65565b9050919050565b6000602082019050818103600083015261207981611c88565b9050919050565b6000602082019050818103600083015261209981611cab565b9050919050565b600060208201905081810360008301526120b981611cce565b9050919050565b600060208201905081810360008301526120d981611cf1565b9050919050565b600060208201905081810360008301526120f981611d14565b9050919050565b6000602082019050818103600083015261211981611d37565b9050919050565b6000602082019050818103600083015261213981611d5a565b9050919050565b6000602082019050818103600083015261215981611d7d565b9050919050565b6000602082019050818103600083015261217981611da0565b9050919050565b6000602082019050818103600083015261219981611dc3565b9050919050565b600060208201905081810360008301526121b981611de6565b9050919050565b600060208201905081810360008301526121d981611e2c565b9050919050565b600060208201905081810360008301526121f981611e4f565b9050919050565b6000602082019050818103600083015261221981611e72565b9050919050565b6000602082019050818103600083015261223981611e95565b9050919050565b6000602082019050818103600083015261225981611eb8565b9050919050565b6000602082019050818103600083015261227981611edb565b9050919050565b60006020820190506122956000830184611efe565b92915050565b60006122a56122b6565b90506122b18282612521565b919050565b6000604051905090565b600067ffffffffffffffff8211156122db576122da6125f9565b5b602082029050602081019050919050565b600067ffffffffffffffff821115612307576123066125f9565b5b602082029050602081019050919050565b600081905092915050565b600082825260208201905092915050565b600061233f82612499565b915061234a83612499565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561237f5761237e61259b565b5b828201905092915050565b600061239582612499565b91506123a083612499565b9250826123b0576123af6125ca565b5b828204905092915050565b60006123c682612499565b91506123d183612499565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561240a5761240961259b565b5b828202905092915050565b600061242082612499565b915061242b83612499565b92508282101561243e5761243d61259b565b5b828203905092915050565b600061245482612479565b9050919050565b600061246682612479565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006124ae826124fd565b9050919050565b60006124c0826124c7565b9050919050565b60006124d282612479565b9050919050565b60006124e4826124eb565b9050919050565b60006124f682612479565b9050919050565b60006125088261250f565b9050919050565b600061251a82612479565b9050919050565b61252a82612628565b810181811067ffffffffffffffff82111715612549576125486125f9565b5b80604052505050565b600061255d82612499565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156125905761258f61259b565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f54686520616363657074656420746f6b656e2061646472657373206d7573742060008201527f62652061206465706c6f79656420636f6e747261637400000000000000000000602082015250565b7f5061796d656e7453706c69747465723a206163636f756e74206973207468652060008201527f7a65726f20616464726573730000000000000000000000000000000000000000602082015250565b7f4e6f7420656e6f75676820746f20627579206576656e206f6e6520746f6b656e600082015250565b7f5061796d656e7453706c69747465723a206163636f756e7420686173206e6f2060008201527f7368617265730000000000000000000000000000000000000000000000000000602082015250565b7f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260008201527f6563697069656e74206d61792068617665207265766572746564000000000000602082015250565b7f416464726573733a20696e73756666696369656e742062616c616e6365000000600082015250565b7f5061796d656e7453706c69747465723a206163636f756e74206973206e6f742060008201527f647565207061796d656e74000000000000000000000000000000000000000000602082015250565b7f596f75206e65656420746f2073656c6c206174206c6561737420736f6d65207460008201527f6f6b656e73000000000000000000000000000000000000000000000000000000602082015250565b7f5061757361626c653a2070617573656400000000000000000000000000000000600082015250565b7f436865636b2074686520746f6b656e20616c6c6f77616e636500000000000000600082015250565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f5061796d656e7453706c69747465723a2070617965657320616e64207368617260008201527f6573206c656e677468206d69736d617463680000000000000000000000000000602082015250565b50565b7f5061796d656e7453706c69747465723a206163636f756e7420616c726561647960008201527f2068617320736861726573000000000000000000000000000000000000000000602082015250565b7f4e6f7420656e6f75676820746f6b656e7320696e207468652072657365727665600082015250565b7f596f75206e65656420746f2073656e6420736f6d652065746865720000000000600082015250565b7f546865204f7261636c65206d7573742062652061206465706c6f79656420636f60008201527f6e74726163740000000000000000000000000000000000000000000000000000602082015250565b7f5061796d656e7453706c69747465723a206e6f20706179656573000000000000600082015250565b7f5061796d656e7453706c69747465723a20736861726573206172652030000000600082015250565b612aa381612449565b8114612aae57600080fd5b50565b612aba8161245b565b8114612ac557600080fd5b50565b612ad18161246d565b8114612adc57600080fd5b50565b612ae881612499565b8114612af357600080fd5b5056fea2646970667358221220ef6203a833c0c43df58457152f685e7ac14f05eb49fdada24b464470c814aa8e64736f6c63430008040033";

export class Dex__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides & { from?: string | Promise<string> }): Promise<Dex> {
    return super.deploy(overrides || {}) as Promise<Dex>;
  }
  getDeployTransaction(overrides?: Overrides & { from?: string | Promise<string> }): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Dex {
    return super.attach(address) as Dex;
  }
  connect(signer: Signer): Dex__factory {
    return super.connect(signer) as Dex__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DexInterface {
    return new utils.Interface(_abi) as DexInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Dex {
    return new Contract(address, _abi, signerOrProvider) as Dex;
  }
}
