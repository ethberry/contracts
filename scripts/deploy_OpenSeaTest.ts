import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

import { baseTokenURInft, tokenName, tokenSymbol } from "../test/constants";

async function main() {
  // We get the contract to deploy
  const nft = await ethers.getContractFactory("TokenNft");
  const proxy = await ethers.getContractFactory("ProxyRegistry");
  const proxyInstance = await proxy.deploy();

  const nftInstance = await nft.deploy(tokenName, tokenSymbol, baseTokenURInft);
  console.info("TokenNft deployed to:", nftInstance.address);

  console.info("proxyInstance.address is:", proxyInstance.address);
  await nftInstance.setProxyRegistry(proxyInstance.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
