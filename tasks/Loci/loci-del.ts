import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";
import { ContractReceipt, ContractTransaction } from "ethers";

task("loci-del", "DELETE LOCI ERC-721 NFT")
  .addParam("contract", "The address of the dNFT contract that you want to read")
  .setAction(async (taskArgs, hre) => {
    const contractAddr = taskArgs.contract;
    const networkId = hre.network.name;
    console.info("Deleting LOCI NFT contract on network ", networkId);
    const factory = await hre.ethers.getContractFactory("Loci");
    // const LOCI_ABI: Array<any>[any] = [];
    // Get signer information
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];

    // Create connection to dNFT Contract and call the createCollectible function
    const LociNFTContract = new hre.ethers.Contract(contractAddr, factory.interface, signer);

    const tx: ContractTransaction = await LociNFTContract.destroy();
    const receipt: ContractReceipt = await tx.wait();
    console.info("DEL receipt: ", receipt.transactionHash);
  });

module.exports = {};
