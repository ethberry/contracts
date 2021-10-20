import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import { Link2 } from "../typechain";

async function main() {
  // We get the contract to deploy
  // const oldnft = await ethers.getContractFactory("LociOpenSea");
  const newlink = await ethers.getContractFactory("Link2");

  // const proxy = await ethers.getContractFactory("ProxyRegistry");
  // const proxyInstance = (await upgrades.deployProxy(proxy)) as ProxyRegistry;

  const oldContractAddress = "0x7d8CE7aB7109c13d2c47518e49e811f0DA012516";
  const newtokenInstance = (await upgrades.upgradeProxy(oldContractAddress, newlink)) as Link2;

  // await newtokenInstance.setProxyRegistry(proxyInstance.address);

  console.info(`Link ${newtokenInstance.address} upgraded`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
