import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import { TokenNft } from "../typechain";

async function main() {
  // We get the contract to deploy
  const newlink = await ethers.getContractFactory("TokenNft");

  const oldContractAddress = "0x8cc86f23Fd4D501192f9799B8564168a3874F784";
  const newtokenInstance = (await upgrades.upgradeProxy(oldContractAddress, newlink)) as TokenNft;

  // await newtokenInstance.setProxyRegistry(proxyInstance.address);

  console.info(`TokenNft ${newtokenInstance.address} upgraded`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
