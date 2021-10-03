import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";
import LociJson from "../../artifacts/contracts/ERC721/Loci/Loci.sol/Loci.json";

task("loci-test", "Test for new LOCI ERC-721 NFT")
  .addParam("contract", "The address of the dNFT contract that you want to read")
  .addParam("tokenind", "The Id of token to read")
  .setAction(async (taskArgs, hre) => {
    const contractAddr = taskArgs.contract;
    const networkId = hre.network.name;
    console.info("Testing LOCI NFT on network ", networkId);
    const LOCI_ABI = LociJson.abi;
    // Get signer information
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];
    // const addr1 = accounts[1];
    // console.log("signer.address:", signer.address);
    // console.log("addr1.address:", addr1.address);

    // Create connection to dNFT Contract and call the createCollectible function
    const LociNFTContract = new hre.ethers.Contract(contractAddr, LOCI_ABI, signer);
    // await LociNFTContract.connect(signer)
    //   .mint(signer.address, { from: signer.address })
    const tokenid = hre.ethers.BigNumber.from(taskArgs.tokenind);
    console.log("tokenid", tokenid);

    // const address = await LociNFTContract.owner();
    // console.log("address", address);

    // await LociNFTContract._addTokenindex();

    // const CurrentTokenindex = await LociNFTContract._getCurrentTokenindex();
    // console.log("CurrentTokenindex", CurrentTokenindex);

    // const res = await LociNFTContract.ownerOf(tokenid._hex);
    // console.log("ownerOf", res);

    const res1 = await LociNFTContract.tokenURI(tokenid._hex);
    console.log("tokenURI", res1);

    // const res2 = await LociNFTContract.tokenOfOwnerByIndex(signer.address, tokenid._hex);
    // console.log("tokenOfOwnerByIndex", res2);
    //
    // const res4 = await LociNFTContract.balanceOf(signer.address);
    // console.log("balanceOf", res4);

    //
    // const res3 = await LociNFTContract.totalSupply();
    // console.log("totalSupply", res3);

    // const BTU = await LociNFTContract.tokenURI(tokenid._hex);
    // console.log("BTU", BTU);
    // console.info(
    //   "To sell your NFT go to https://testnets.opensea.io/account",
    //   "and sign in with the same wallet used in this transaction.",
    // );
  });

module.exports = {};
