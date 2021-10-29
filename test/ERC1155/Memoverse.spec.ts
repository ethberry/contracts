import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Memoverse } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE, TEST_DATA, URI_SETTER_ROLE } from "../constants";

describe("Memoverse", function () {
  let nft: ContractFactory;
  let nftInstance: Memoverse;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("Memoverse");
    [owner, addr1] = await ethers.getSigners();

    nftInstance = (await nft.deploy()) as Memoverse;
  });

  describe("Deployment", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await nftInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await nftInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
      const isPauser = await nftInstance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
      const isUrlSetter = await nftInstance.hasRole(URI_SETTER_ROLE, owner.address);
      expect(isUrlSetter).to.equal(true);
    });
  });

  describe("Mint", function () {
    it("should fail: for wrong role", async function () {
      const tx = nftInstance.connect(addr1).mint(addr1.address, 1, amount, TEST_DATA);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${addr1.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint more tokens", async function () {
      await nftInstance.mint(owner.address, 1, amount, TEST_DATA);
      const balance = await nftInstance.balanceOf(owner.address, 1);
      expect(balance).to.equal(amount);
    });
  });

  describe("Transfer", function () {
    it("should fail: insufficient balance for transfer", async function () {
      const tx = nftInstance.safeTransferFrom(owner.address, addr1.address, 1, amount, TEST_DATA);
      await expect(tx).to.be.revertedWith("ERC1155: insufficient balance for transfer");
    });

    it("should transfer tokens to another address", async function () {
      await nftInstance.mint(owner.address, 1, amount, TEST_DATA);
      await nftInstance.safeTransferFrom(owner.address, addr1.address, 1, amount, TEST_DATA);

      const balanceOfOwner = await nftInstance.balanceOf(owner.address, 1);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await nftInstance.balanceOf(addr1.address, 1);
      expect(balanceOfReceiver).to.equal(amount);
    });
  });
});
