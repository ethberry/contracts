import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { LociOpenSea, ProxyRegistry } from "../../../typechain";
import { baseTokenURI } from "../../constants";

describe("Loci OpenSea", function () {
  let nft: ContractFactory;
  let nftInstance: LociOpenSea;
  let proxy: ContractFactory;
  let proxyInstance: ProxyRegistry;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("LociOpenSea");
    proxy = await ethers.getContractFactory("ProxyRegistry");
    [owner, addr1] = await ethers.getSigners();

    proxyInstance = (await upgrades.deployProxy(proxy)) as ProxyRegistry;
    nftInstance = (await upgrades.deployProxy(nft, [
      "memoryOS NFT token",
      "Loci (OpenSea)",
      baseTokenURI,
    ])) as LociOpenSea;

    await nftInstance.setProxyRegistry(proxyInstance.address);
  });

  describe("Deployment", function () {
    it("Should set owner", async function () {
      const address = await nftInstance.owner();
      expect(address).to.equal(owner.address);
    });
  });

  describe("baseTokenURI", function () {
    it("should return base token uri", async function () {
      await nftInstance.mint(owner.address);
      await nftInstance.transferFrom(owner.address, addr1.address, 0);

      const uri = await nftInstance.baseTokenURI();
      expect(uri).to.equal(baseTokenURI);
    });
  });
});
