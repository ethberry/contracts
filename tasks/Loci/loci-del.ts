import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";
import LociJson from "../../artifacts/contracts/ERC721/Loci/Loci.sol/Loci.json";
import { ContractReceipt, ContractTransaction } from "ethers";

task("loci-del", "DELETE LOCI ERC-721 NFT")
  .addParam("contract", "The address of the dNFT contract that you want to read")
  .setAction(async (taskArgs, hre) => {
    const contractAddr = taskArgs.contract;
    const networkId = hre.network.name;
    console.info("Deleting LOCI NFT contract on network ", networkId);
    const LOCI_ABI = LociJson.abi;
    // const LOCI_ABI: Array<any>[any] = [];
    // Get signer information
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];

    // Create connection to dNFT Contract and call the createCollectible function
    const LociNFTContract = new hre.ethers.Contract(contractAddr, LOCI_ABI, signer);

    const tx: ContractTransaction = await LociNFTContract.destroy();
    const receipt: ContractReceipt = await tx.wait();
    console.log("DEL receipt: ", receipt.transactionHash);
  });

module.exports = {};
