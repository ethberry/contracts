import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

import { tokenId } from "@ethberry/contracts-constants";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldUserOf(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721 } = options;

  describe("userOf", function () {
    it.only("should return 0", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId);

      const current = await time.latest();
      const deadline = current - 1;

      await contractInstance.setUser(tokenId, receiver, deadline);
      const userOf = await contractInstance.userOf(tokenId);

      expect(userOf).to.equal(ZeroAddress);
    });

    it("should return 0, when time is expired", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId);

      const current = await time.latest();
      const deadline = current + 100;

      await contractInstance.setUser(tokenId, receiver, deadline.toString());

      const current1 = await time.latest();
      await time.increaseTo(current1 + 50);

      const userOf1 = await contractInstance.userOf(tokenId);
      expect(userOf1).to.equal(receiver);

      const current2 = await time.latest();
      await time.increaseTo(current2 + 50);

      const userOf2 = await contractInstance.userOf(tokenId);
      expect(userOf2).to.equal(ZeroAddress);
    });

    it("Owner is still the owner of NFT", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId);

      const current = await time.latest();
      const deadline = current + 100;

      await contractInstance.setUser(tokenId, receiver, deadline.toString());

      const ownerOfToken = await contractInstance.ownerOf(tokenId);

      expect(ownerOfToken).to.equal(owner);
    });
  });
}
