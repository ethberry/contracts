import { ethers } from "hardhat";
import { ContractTransaction } from "ethers";

async function main() {
  // const [owner] = await ethers.getSigners();

  const coinFactory = await ethers.getContractFactory("SkinLootBoxRandom");
  const coinInstance = coinFactory.attach(
    "0x40E668B0cEf7d61FB5Ab7aD9Ad7BF8FA48769517", // The deployed LootBox contract address
  );
  // // Mint LootBox ERC721 Token
  // const tx: ContractTransaction = await coinInstance.mint(owner.address);
  // await tx.wait();

  // Create connection to LINK token contract and initiate the transfer

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
  // ]; // rinkeby
  // const LINK_TOKEN_ABI = [
  //   {
  //     constant: false,
  //     inputs: [
  //       { name: "_to", type: "address" },
  //       { name: "_value", type: "uint256" },
  //     ],
  //     name: "transfer",
  //     outputs: [{ name: "success", type: "bool" }],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  // ]; // binance
  // // const linkContractAddr = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"; // rinkeby link
  // const linkContractAddr = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06"; // binANCE link
  // const linkTokenContract = new ethers.Contract(linkContractAddr, LINK_TOKEN_ABI, owner);
  // await linkTokenContract.transfer(coinInstance.address, parseEther("1.0")).then(function (transaction: any) {
  //   console.info("Contract ", coinInstance.address, " funded with 1 LINK. Transaction: ", transaction);
  // });

  const tx: ContractTransaction = await coinInstance.unpack(0);
  await tx.wait();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
