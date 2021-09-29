import "@nomiclabs/hardhat-ethers";
import { ethers, upgrades } from "hardhat";
import { LociOpenSea2 } from "../typechain";

async function main() {
  // We get the contract to deploy
  // const oldnft = await ethers.getContractFactory("LociOpenSea");
  const newnft = await ethers.getContractFactory("LociOpenSea2");

  // const proxy = await ethers.getContractFactory("ProxyRegistry");
  // const proxyInstance = (await upgrades.deployProxy(proxy)) as ProxyRegistry;

  const oldContractAddress = "0x34471fa7c9195516805bb05ed245dcbbaec4b5f2";
  const newtokenInstance = (await upgrades.upgradeProxy(oldContractAddress, newnft)) as LociOpenSea2;

  // await newtokenInstance.setProxyRegistry(proxyInstance.address);

  console.info(`MindToken ${newtokenInstance.address} upgraded`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
