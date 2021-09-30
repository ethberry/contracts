import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";

task("link-random", "Get random number from Link contract")
  .addParam("contract", "The address of the dNFT contract that you want to read")
  .addParam("seed", "userProvidedSeed")
  .setAction(async (taskArgs, hre) => {
    const LINK_ABI = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "bytes32",
            name: "requestId",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "randomness",
            type: "uint256",
          },
        ],
        name: "GotRandomness",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "Snapshot",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "userProvidedSeed",
            type: "uint256",
          },
        ],
        name: "getRandomNumber",
        outputs: [
          {
            internalType: "bytes32",
            name: "requestId",
            type: "bytes32",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "requestId",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "randomness",
            type: "uint256",
          },
        ],
        name: "rawFulfillRandomness",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const contractAddr = taskArgs.contract;
    // const seed = hre.ethers.BigNumber.from((taskArgs.seed * 1e18).toString());
    const seed = taskArgs.seed;

    const networkName = hre.network.name;
    console.info("Getting random from Link in ", networkName);
    console.info("With seed ", seed);
    // Get signer information
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];

    // Create connection to dNFT Contract and call the function
    const LinkContract = new hre.ethers.Contract(contractAddr, LINK_ABI, signer);

    // const TOW = await LinkContract.owner();
    // console.log("LinkContract", LinkContract);

    const randomNumber = await LinkContract.getRandomNumber(seed).then(() => console.info("Got Random! "));
    console.info("Random is ", randomNumber);
  });

module.exports = {};
