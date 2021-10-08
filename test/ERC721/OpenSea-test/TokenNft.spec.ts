import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { TokenNft } from "../../../typechain";
import { baseTokenURInft, DEFAULT_ADMIN_ROLE, MINTER_ROLE, nftcap1 } from "../../constants";

describe("TokenNft", function () {
  let nft: ContractFactory;
  let nftInstance: TokenNft;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("TokenNft");
    [owner, addr1] = await ethers.getSigners();

    nftInstance = (await upgrades.deployProxy(nft, [
      "TokenNft opensea test token",
      "TokenNft",
      baseTokenURInft,
    ])) as TokenNft;
  });

  describe("Deployment", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await nftInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await nftInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
    });
  });

  describe("Mint", function () {
    it("should fail for wrong role", async function () {
      const tx = nftInstance.connect(addr1).mint(addr1.address);
      await expect(tx).to.be.revertedWith("Error: must have minter role to mint");
    });

    it("should set initial cap", async function () {
      const cap = await nftInstance.cap();
      expect(cap).to.equal(100);
    });

    it("should set new cap", async function () {
      await nftInstance._setCap(nftcap1);
      const newcap = await nftInstance.cap();
      expect(newcap).to.equal(nftcap1);
    });

    it("should fail if new cap too low", async function () {
      await nftInstance.mint(owner.address);
      await nftInstance.mint(owner.address);
      await nftInstance.mint(owner.address);
      const tx = nftInstance._setCap(nftcap1);
      await expect(tx).to.be.revertedWith("ERC721Capped: cap too low");
    });

    it("should fail if cap exceeded", async function () {
      await nftInstance._setCap(nftcap1);
      await nftInstance.mint(owner.address);
      await nftInstance.mint(owner.address);
      const tx = nftInstance.mint(owner.address);
      await expect(tx).to.be.revertedWith("ERC721Capped: cap exceeded");
    });

    it("should mint more tokens", async function () {
      await nftInstance.mint(owner.address);
      await nftInstance.mint(owner.address);
      await nftInstance.mint(owner.address);
      const balance = await nftInstance.balanceOf(owner.address);
      const tokenCount = await nftInstance._tokenIdTracker();
      expect(balance).to.equal(tokenCount);
    });

    it("should emit TokenMint event", async function () {
      const tokenCount = await nftInstance._tokenIdTracker();
      const tx = nftInstance.mint(owner.address);
      await expect(tx).to.emit(nftInstance, "TokenMint").withArgs(owner.address, tokenCount);
    });

    it("should set token URI", async function () {
      await nftInstance.mint(owner.address);
      const uri = await nftInstance.tokenURI(0);
      expect(uri).to.equal(`${baseTokenURInft}0`);
    });
  });

  describe("Transfer", function () {
    it("should transfer tokens to another address", async function () {
      await nftInstance.mint(owner.address);
      await nftInstance.transferFrom(owner.address, addr1.address, 0);

      const balanceOfOwner = await nftInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await nftInstance.balanceOf(addr1.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await nftInstance.tokenOfOwnerByIndex(addr1.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });
  });
});
