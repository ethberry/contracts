import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";

task("test-mint", "Mints some TokenNft ERC-721")
  .addParam("contract", "The address of the dNFT contract that you want to read")
  .setAction(async (taskArgs, hre) => {
    const contractAddr = taskArgs.contract;
    const networkId = hre.network.name;
    console.info("Mint some TokenNft on network ", networkId);
    const factory = await hre.ethers.getContractFactory("TokenNft");
    // const LOCI_ABI: Array<any>[any] = [];

    // Get signer information
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];

    // Create connection to dNFT Contract and call the createCollectible function
    const NFTContract = new hre.ethers.Contract(contractAddr, factory.interface, signer);

    await NFTContract.mint(signer.address).then(() => console.info(" mint 0 asked!"));
    await NFTContract.mint(signer.address).then(() => console.info(" mint 1 asked!"));
    await NFTContract.mint(signer.address).then(() => console.info(" mint 2 asked!"));
    await NFTContract.mint(signer.address).then(() => console.info(" mint 3 asked!"));
  });

module.exports = {};
