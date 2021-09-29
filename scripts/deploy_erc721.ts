import "@nomiclabs/hardhat-ethers";
import { ethers, upgrades } from "hardhat";
import { baseTokenURI } from "../test/constants";
import { LociOpenSea, ProxyRegistry } from "../typechain";

async function main() {
  // We get the contract to deploy
  const nft = await ethers.getContractFactory("LociOpenSea");
  const proxy = await ethers.getContractFactory("ProxyRegistry");
  const proxyInstance = (await upgrades.deployProxy(proxy)) as ProxyRegistry;

  const nftInstance = (await upgrades.deployProxy(nft, [
    "memoryOS NFT token",
    "Loci (OpenSea)",
    baseTokenURI,
  ])) as LociOpenSea;

  await nftInstance.setProxyRegistry(proxyInstance.address);

  console.info("MindToken deployed to:", nftInstance.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
