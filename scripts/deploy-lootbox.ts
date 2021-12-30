import { ethers, run } from "hardhat";
import { parseEther } from "ethers/lib/utils";
import { ContractTransaction } from "ethers";

import { MINTER_ROLE, tokenName, tokenSymbol, baseTokenURI } from "../test/constants";

async function main() {
  await run("compile");
  const [owner] = await ethers.getSigners();
  const linkContractAddr = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06"; // BINANCE @linkAddr
  const vrfCoordinatorAddr = "0xa555fC018435bef5A13C6c6870a9d4C11DEC329C"; // BINANCE @vrfCoordinatorAddr
  // const linkContractAddr = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06"; // rinkeby @linkAddr
  // const vrfCoordinatorAddr = "0xa555fC018435bef5A13C6c6870a9d4C11DEC329C"; // rinkeby @vrfCoordinatorAddr

  // ERC721 Token contract
  const coinFactory = await ethers.getContractFactory("SkinLink");
  const coinInstance = await coinFactory.deploy(tokenName, tokenSymbol, baseTokenURI);
  console.info(`ERC721SkinAddress=${coinInstance.address}`);

  // Lootbox contract
  const lootFactory = await ethers.getContractFactory("SkinLootBoxRandom");
  const lootInstance = await lootFactory.deploy(tokenName, tokenSymbol, baseTokenURI);
  console.info(`LootBoxAddress=${lootInstance.address}`);

  // Set MINTER role to Lootbox
  const txx = await coinInstance.grantRole(MINTER_ROLE, lootInstance.address);
  console.info("Role MINTER_ROLE granted to Lootbox, Tx: ", txx.hash);

  // Set MINTER role to VRFCoordinator
  const txxr = await coinInstance.grantRole(MINTER_ROLE, vrfCoordinatorAddr);
  console.info("Role MINTER_ROLE granted to VRFCoordinator, Tx: ", txxr.hash);

  // Set Factory
  const trx = await lootInstance.setFactory(coinInstance.address);
  console.info("Factory set in Lootbox, Tx: ", trx.hash);

  // rinkeby
  // const LINK_TOKEN_ABI = [
  //   {
  //     constant: false,
  //     inputs: [
  //       {
  //         name: "_to",
  //         type: "address",
  //       },
  //       {
  //         name: "_value",
  //         type: "uint256",
  //       },
  //     ],
  //     name: "transfer",
  //     outputs: [
  //       {
  //         name: "success",
  //         type: "bool",
  //       },
  //     ],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  // ];

  // binance
  const LINK_TOKEN_ABI = [
    {
      constant: false,
      inputs: [
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "success", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  // Create connection to LINK token contract and initiate the transfer
  const linkTokenContract = new ethers.Contract(linkContractAddr, LINK_TOKEN_ABI, owner);
  await linkTokenContract.transfer(coinInstance.address, parseEther("1.0")).then(function (transaction: any) {
    console.info("Contract ", coinInstance.address, " funded with 1 LINK. Tx: ", transaction.hash);
  });

  // Mint 1 ERC721 Lootbox to Owner
  const tx: ContractTransaction = await lootInstance.safeMint(owner.address);
  await tx.wait();
  console.info("1 ERC721 Lootbox minted to Owner, Tx: ", tx.hash);

  // ERC721SkinAddress=0x29A36c25225Bba399925a8D7554A28727Accdd12
  // LootBoxAddress=0x40E668B0cEf7d61FB5Ab7aD9Ad7BF8FA48769517
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
