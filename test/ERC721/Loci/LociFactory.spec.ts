import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Loci, LociFactory, LootBox, ProxyRegistry } from "../../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, tokenName, tokenSymbol } from "../../constants";

describe("LociFactory", function () {
  let nft: ContractFactory;
  let nftInstance: Loci;
  let lootBox: ContractFactory;
  let lootBoxInstance: LootBox;
  let proxy: ContractFactory;
  let proxyInstance: ProxyRegistry;
  let factory: ContractFactory;
  let factoryInstance: LociFactory;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("Loci");
    proxy = await ethers.getContractFactory("ProxyRegistry");
    factory = await ethers.getContractFactory("LociFactory");
    lootBox = await ethers.getContractFactory("LootBox");
    [owner] = await ethers.getSigners();

    nftInstance = (await nft.deploy(tokenName, tokenSymbol, baseTokenURI)) as Loci;

    proxyInstance = (await proxy.deploy()) as ProxyRegistry;

    factoryInstance = (await factory.deploy(baseTokenURI)) as LociFactory;
    await factoryInstance.setProxyRegistry(proxyInstance.address);
    await factoryInstance.setTradable(nftInstance.address);

    lootBoxInstance = (await lootBox.deploy(tokenName, tokenSymbol, baseTokenURI)) as LootBox;
    await lootBoxInstance.setFactory(factoryInstance.address);
    await factoryInstance.setLootBox(lootBoxInstance.address);
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await factoryInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
    });
  });
});
