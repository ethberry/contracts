import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { MindNFT, ProxyRegistry } from "../../typechain";
import { baseTokenURI } from "../constants";

describe("ERC721 (owner)", function () {
  let nft: ContractFactory;
  let proxy: ContractFactory;
  let nftInstance: MindNFT;
  let proxyInstance: ProxyRegistry;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("MindNFT");
    proxy = await ethers.getContractFactory("ProxyRegistry");
    [owner, addr1] = await ethers.getSigners();

    proxyInstance = (await upgrades.deployProxy(proxy)) as ProxyRegistry;
    nftInstance = (await upgrades.deployProxy(
      nft,
      ["memoryOS NFT token", "MIND", baseTokenURI, proxyInstance.address],
      { initializer: "initialize(string name, string symbol, string baseURI, address proxyRegistry)" },
    )) as MindNFT;
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
