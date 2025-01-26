import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

import { tokenId } from "@ethberry/contracts-constants";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldSetUser(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721 } = options;

  describe("setUser", function () {
    it("should set a user to a token", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId);

      const current = await time.latest();
      const deadline = current + 100;

      await contractInstance.setUser(tokenId, receiver, deadline.toString());

      const userOf = await contractInstance.userOf(tokenId);

      expect(userOf).to.equal(receiver);
    });

    it("should set a user from approved address", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId);

      const current = await time.latest();
      const deadline = current + 100;

      await contractInstance.approve(receiver, tokenId);
      await contractInstance.setUser(tokenId, receiver, deadline.toString());

      const userOf = await contractInstance.userOf(tokenId);

      expect(userOf).to.equal(receiver);
    });

    it("should set a user from approvedAll address", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId);

      const current = await time.latest();
      const deadline = current + 100;

      await contractInstance.setApprovalForAll(receiver, true);
      await contractInstance.setUser(tokenId, receiver, deadline.toString());

      const userOf = await contractInstance.userOf(tokenId);

      expect(userOf).to.equal(receiver);
    });

    it("emits a UpdateUser event", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId);

      const current = await time.latest();
      const deadline = current + 100;

      const tx = contractInstance.setUser(tokenId, receiver, deadline.toString());

      await expect(tx).to.emit(contractInstance, "UpdateUser").withArgs(tokenId, receiver, deadline.toString());
    });

    it("should fail: don't have permission to set a user", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId);

      const current = await time.latest();
      const deadline = current + 100;

      const tx = contractInstance.connect(receiver).setUser(tokenId, receiver, deadline.toString());
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "ERC721InsufficientApproval")
        .withArgs(receiver, tokenId);
    });
  });
}
