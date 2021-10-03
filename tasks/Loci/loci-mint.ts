import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";
import LociJson from "../../artifacts/contracts/ERC721/Loci/Loci.sol/Loci.json";

task("loci-mint", "Creates a new LOCI ERC-721 NFT")
  .addParam("contract", "The address of the dNFT contract that you want to read")
  .setAction(async (taskArgs, hre) => {
    const contractAddr = taskArgs.contract;
    const networkId = hre.network.name;
    console.info("Mint random LOCI NFT on network ", networkId);
    const LOCI_ABI = LociJson.abi;
    // Get signer information
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];

    // Create connection to dNFT Contract and call the createCollectible function
    const LociNFTContract = new hre.ethers.Contract(contractAddr, LOCI_ABI, signer);
    // await LociNFTContract._mintRandom(hre.ethers.BigNumber.from(1), signer.address).then(() => console.info("Mint"));

    await LociNFTContract.mintRandom().then(() => console.info("Random mint 2 asked!"));
    await LociNFTContract.mintRandom().then(() => console.info("Random mint 3 asked!"));
    await LociNFTContract.mintRandom().then(() => console.info("Random mint 4 asked!"));
    await LociNFTContract.mintRandom().then(() => console.info("Random mint 5 asked!"));
    // await LociNFTContract.mintRandom().then(() => console.info("Random mint 2 asked!"));
    // await LociNFTContract.mintRandom().then(() => console.info("Random mint 3 asked!"));
    // const randomNum = hre.ethers.BigNumber.from(1);
    // await LociNFTContract._mintRandom(hre.ethers.BigNumber.from(1), signer.address).then(() => console.info("Random minted!"));
    // const BTU = await LociNFTContract.tokenURI(tokenid._hex);
    // console.log("BTU", BTU);
    // console.info(
    //   "To sell your NFT go to https://testnets.opensea.io/account",
    //   "and sign in with the same wallet used in this transaction.",
    // );
  });

module.exports = {};
