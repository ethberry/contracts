import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";

task("fund-link", "Funds a contract with LINK")
  .addParam("contract", "The address of the contract that requires LINK")
  .setAction(async (taskArgs, hre) => {
    const contractAddr = taskArgs.contract;
    const networkName = hre.network.name;
    console.info("Funding contract ", contractAddr, " on network ", networkName);
    const LINK_TOKEN_ABI = [
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    // set the LINK token contract address according to the environment
    let linkContractAddr: string;
    switch (networkName) {
      case "rinkeby":
        linkContractAddr = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
        break;
      case "mumbai":
        linkContractAddr = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
        break;
      default:
        // default to rinkeby
        linkContractAddr = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
    }
    // Fund with 1 LINK token
    const amount = hre.web3.utils.toHex(1e18);

    // Get signer information
    const [owner] = await hre.ethers.getSigners();

    // Create connection to LINK token contract and initiate the transfer
    const linkTokenContract = new hre.ethers.Contract(linkContractAddr, LINK_TOKEN_ABI, owner);
    await linkTokenContract.transfer(contractAddr, amount).then(function (transaction: any) {
      console.info("Contract ", contractAddr, " funded with 1 LINK. Transaction Hash: ", transaction.hash);
    });
  });

module.exports = {};
