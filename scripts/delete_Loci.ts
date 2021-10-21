import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

import { baseTokenURI } from "../test/constants";

async function main() {
  // We get the contract to deploy
  const nft = await ethers.getContractFactory("LociOpenSea");
  const proxy = await ethers.getContractFactory("ProxyRegistry");
  const proxyInstance = await proxy.deploy();

  const nftInstance = await nft.deploy("LociNFT-test-v4", "Loci (OpenSea)", baseTokenURI);
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
