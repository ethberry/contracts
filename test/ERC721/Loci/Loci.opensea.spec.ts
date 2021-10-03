import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Loci, ProxyRegistry } from "../../../typechain";
import { baseTokenURI } from "../../constants";

describe("Loci OpenSea", function () {
  let nft: ContractFactory;
  let nftInstance: Loci;
  let proxy: ContractFactory;
  let proxyInstance: ProxyRegistry;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("Loci");
    proxy = await ethers.getContractFactory("ProxyRegistry");
    [owner, addr1] = await ethers.getSigners();

    proxyInstance = (await upgrades.deployProxy(proxy)) as ProxyRegistry;
    nftInstance = (await upgrades.deployProxy(nft, ["memoryOS NFT token", "Loci (OpenSea)", baseTokenURI])) as Loci;

    await nftInstance.setProxyRegistry(proxyInstance.address);
  });

  describe("Deployment", function () {
    it("should set owner", async function () {
      const address = await nftInstance.owner();
      expect(address).to.equal(owner.address);
    });
  });

  // describe("baseTokenURI", function () {
  //   it("should return base token uri", async function () {
  //     const uri = await nftInstance._baseURI();
  //     expect(uri).to.equal(`${baseTokenURI}`);
  //   });
  // });
});
