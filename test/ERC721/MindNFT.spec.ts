import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { MindNFT } from "../../typechain";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE } from "../constants";

describe("ERC721", function () {
  let nft: ContractFactory;
  let nftInstance: MindNFT;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("MindNFT");
    [owner, addr1] = await ethers.getSigners();

    nftInstance = (await upgrades.deployProxy(nft, ["memoryOS NFT token", "MIND", baseTokenURI])) as MindNFT;
  });

  describe("Deployment", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await nftInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await nftInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
      const isPauser = await nftInstance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
    });
  });

  describe("Mint", function () {
    it("should fail for wrong role", async function () {
      const tx = nftInstance.connect(addr1).mint(addr1.address);
      await expect(tx).to.be.revertedWith("ERC721PresetMinterPauserAutoId: must have minter role to mint");
    });

    it("should mint more tokens", async function () {
      await nftInstance.mint(owner.address);
      const balance = await nftInstance.balanceOf(owner.address);
      expect(balance).to.equal(1);
      const item = await nftInstance.tokenOfOwnerByIndex(owner.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });
  });

  describe("Transfer", function () {
    it("should transfer tokens to DEX", async function () {
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

  describe("baseTokenURI (OpenSea)", function () {
    it("should return base token uri", async function () {
      await nftInstance.mint(owner.address);
      await nftInstance.transferFrom(owner.address, addr1.address, 0);

      const uri = await nftInstance.baseTokenURI();
      expect(uri).to.equal(baseTokenURI);
    });
  });
});
