import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Loci } from "../../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE, tokenName, tokenSymbol } from "../../constants";

describe("Loci", function () {
  let nft: ContractFactory;
  let nftInstance: Loci;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("Loci");
    [owner, receiver] = await ethers.getSigners();

    nftInstance = (await nft.deploy(tokenName, tokenSymbol, baseTokenURI)) as Loci;
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

  // describe("Random mint", function () {
  //   it("should mint with random URI", async function () {
  //     // const requestId = ethers.utils.formatBytes32String("345AE98B12705470C8D");
  //     const randomness = ethers.BigNumber.from(2);
  //     const currentTokenIndex = await nftInstance._getCurrentTokenindex();
  //     await nftInstance._mintRandom(randomness, owner.address);
  //     const balance = await nftInstance.balanceOf(owner.address);
  //     expect(balance).to.equal(1);
  //     const token = await nftInstance.tokenOfOwnerByIndex(owner.address, currentTokenIndex);
  //     expect(token).to.equal(currentTokenIndex);
  //     const randomuri = await nftInstance.tokenURI(token);
  //     expect(randomuri).to.equal(`${baseTokenURI}2/0`);
  //   });
  // });

  describe("Mint", function () {
    it("should fail for wrong role", async function () {
      const tx = nftInstance.connect(receiver).mintTo(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it.skip("should mint more not random tokens", async function () {
      const tokenIndex = await nftInstance._getCurrentTokenindex();
      await nftInstance.mintTo(owner.address);
      const balance = await nftInstance.balanceOf(owner.address);
      const newTokenIndex = await nftInstance._getCurrentTokenindex();
      expect(balance).to.equal(newTokenIndex);
      const uri = await nftInstance.tokenURI(tokenIndex);
      expect(uri).to.equal(`${baseTokenURI}0`);
    });
  });
  describe("Transfer", function () {
    it("should transfer tokens to another address", async function () {
      await nftInstance.mintTo(owner.address);
      await nftInstance.transferFrom(owner.address, receiver.address, 0);

      const balanceOfOwner = await nftInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await nftInstance.balanceOf(receiver.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await nftInstance.tokenOfOwnerByIndex(receiver.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });
  });
});
