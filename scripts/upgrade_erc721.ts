import "@nomiclabs/hardhat-ethers";
import { ethers, upgrades } from "hardhat";
import { Loci, ProxyRegistry } from "../typechain";

async function main() {
  // We get the contract to deploy
  // const oldnft = await ethers.getContractFactory("LociOpenSea");
  const newnft = await ethers.getContractFactory("Loci");

  // const proxy = await ethers.getContractFactory("ProxyRegistry");
  // const proxyInstance = (await upgrades.deployProxy(proxy)) as ProxyRegistry;

  const oldContractAddress = "0xFfdb7cD34d5B0d2d263fBFB3559D342c3D83Df9D";
  const newtokenInstance = (await upgrades.upgradeProxy(oldContractAddress, newnft)) as Loci;

  // await newtokenInstance.setProxyRegistry(proxyInstance.address);

  console.info(`Contract ${newtokenInstance.address} upgraded`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
