import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import { tokenName, tokenSymbol } from "../test/constants";

async function main() {
  // We get the contract to deploy
  const token = await ethers.getContractFactory("MindCoin");
  // ethers.utils.parseUnits("10", "gwei");

  const tokenInstance = await token.deploy(tokenName, tokenSymbol);
  console.info("MindToken deployed to:", tokenInstance.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
