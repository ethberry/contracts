import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Loci, LociFactory, LociLootBox, ProxyRegistry } from "../../../typechain";
import { baseTokenURI, DEFAULT_ADMIN_ROLE } from "../../constants";

describe("LociFactory", function () {
  let nft: ContractFactory;
  let nftInstance: Loci;
  let lootBox: ContractFactory;
  let lootBoxInstance: LociLootBox;
  let proxy: ContractFactory;
  let proxyInstance: ProxyRegistry;
  let factory: ContractFactory;
  let factoryInstance: LociFactory;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("Loci");
    proxy = await ethers.getContractFactory("ProxyRegistry");
    factory = await ethers.getContractFactory("LociFactory");
    lootBox = await ethers.getContractFactory("LociLootBox");
    [owner] = await ethers.getSigners();

    nftInstance = (await upgrades.deployProxy(nft, ["memoryOS NFT token", "Loci", baseTokenURI])) as Loci;

    proxyInstance = (await upgrades.deployProxy(proxy)) as ProxyRegistry;

    factoryInstance = (await upgrades.deployProxy(factory, [baseTokenURI])) as LociFactory;
    await factoryInstance.setProxyRegistry(proxyInstance.address);
    await factoryInstance.setTradable(nftInstance.address);

    lootBoxInstance = (await upgrades.deployProxy(lootBox, [
      "memoryOS NFT token",
      "Loci",
      baseTokenURI,
    ])) as LociLootBox;
    await lootBoxInstance.setFactory(factoryInstance.address);
    await factoryInstance.setLootBox(lootBoxInstance.address);
  });

  describe("Deployment", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await factoryInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
    });
  });
});
