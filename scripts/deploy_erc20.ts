import "@nomiclabs/hardhat-ethers";
import { ethers, upgrades } from "hardhat";
import { initialTokenAmount } from "../test/constants";
import { MindCoin } from "../typechain";

async function main() {
  // We get the contract to deploy
  const token = await ethers.getContractFactory("MindCoin");
  const tokenInstance = (await upgrades.deployProxy(token, [
    "memoryOS COIN token",
    "MIND",
    initialTokenAmount,
  ])) as MindCoin;

  console.info("MindToken deployed to:", tokenInstance.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
