import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Loci, LootBox2 } from "../../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE, tokenName, tokenSymbol } from "../../constants";

describe("LootBox2", function () {
  let nft: ContractFactory;
  let nftInstance: Loci;
  let lootbox: ContractFactory;
  let lootboxInstance: LootBox2;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("Loci");
    lootbox = await ethers.getContractFactory("LootBox2");
    [owner, receiver] = await ethers.getSigners();

    nftInstance = (await nft.deploy(tokenName, tokenSymbol, baseTokenURI)) as Loci;
    lootboxInstance = (await lootbox.deploy(tokenName, tokenSymbol, baseTokenURI)) as LootBox2;

    await lootboxInstance.setTradable(nftInstance.address);
  });

  describe("Deployment", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await lootboxInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await lootboxInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
      const isPauser = await lootboxInstance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
    });
  });

  describe("Mint", function () {
    it("should fail for wrong role", async function () {
      const tx = lootboxInstance.connect(receiver).mintTo(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint token", async function () {
      await lootboxInstance.mintTo(owner.address);
      const balance = await lootboxInstance.balanceOf(owner.address);
      expect(balance).to.equal(1);
      const item = await lootboxInstance.tokenOfOwnerByIndex(owner.address, 0);
      expect(item).to.equal(0); // 0 is nft index
      const uri = await lootboxInstance.tokenURI(0);
      expect(uri).to.equal(`${baseTokenURI}0`);
    });
  });

  describe.skip("Unpack", function () {
    it("should unpack fro owner", async function () {
      await lootboxInstance.mintTo(owner.address);
      const item = await lootboxInstance.tokenOfOwnerByIndex(owner.address, 0);
      await lootboxInstance.unpack(item);
      const balance = await lootboxInstance.balanceOf(owner.address);
      expect(balance).to.equal(0);
      const balanceNft = await nftInstance.balanceOf(owner.address);
      expect(balanceNft).to.equal(1);
    });

    it("should unpack for receiver", async function () {
      await lootboxInstance.mintTo(receiver.address);
      const item = await lootboxInstance.tokenOfOwnerByIndex(receiver.address, 0);
      await lootboxInstance.connect(receiver).unpack(item);
      const balance = await lootboxInstance.balanceOf(receiver.address);
      expect(balance).to.equal(0);
      const balanceNft = await nftInstance.balanceOf(receiver.address);
      expect(balanceNft).to.equal(1);
    });
  });
});
