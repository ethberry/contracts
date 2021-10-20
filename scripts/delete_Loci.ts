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
    "LociNFT-test-v4",
    "Loci (OpenSea)",
    baseTokenURI,
  ])) as LociOpenSea;
  console.info("Loci-Nft deployed to:", nftInstance.address);

  console.info("proxyInstance.address is:", proxyInstance.address);
  await nftInstance.setProxyRegistry(proxyInstance.address);
  await nftInstance.destroy();
  console.info("Loci-Nft deleted? ");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
