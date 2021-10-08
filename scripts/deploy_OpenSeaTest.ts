import "@nomiclabs/hardhat-ethers";
import { ethers, upgrades } from "hardhat";
import { getImplementationAddress } from "@openzeppelin/upgrades-core";

import { baseTokenURInft } from "../test/constants";
import { TokenNft, ProxyRegistry } from "../typechain";

async function main() {
  // We get the contract to deploy
  const nft = await ethers.getContractFactory("TokenNft");
  const proxy = await ethers.getContractFactory("ProxyRegistry");
  const proxyInstance = (await upgrades.deployProxy(proxy)) as ProxyRegistry;

  const nftInstance = (await upgrades.deployProxy(nft, ["TestNFT", "(OpenSea test)", baseTokenURInft])) as TokenNft;
  console.info("TokenNft deployed to:", nftInstance.address);

  console.info("proxyInstance.address is:", proxyInstance.address);
  await nftInstance.setProxyRegistry(proxyInstance.address);

  const currentImplAddress = await getImplementationAddress(ethers.provider, nftInstance.address);
  console.info("TokenNft implementation is:", currentImplAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
