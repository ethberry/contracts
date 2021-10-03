import "@nomiclabs/hardhat-ethers";
import { ethers, upgrades } from "hardhat";
import { MindCoin } from "../typechain";

async function main() {
  // We get the contract to deploy
  const token = await ethers.getContractFactory("MindCoin");
  // ethers.utils.parseUnits("10", "gwei");

  const tokenInstance = (await upgrades.deployProxy(token, ["link test COIN token", "LINK"])) as MindCoin;
  console.info("MindToken deployed to:", tokenInstance.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
