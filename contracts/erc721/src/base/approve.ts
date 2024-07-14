import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { tokenId } from "@gemunion/contracts-constants";

import type { IERC721Options } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldApprove(factory: () => Promise<any>, options: IERC721Options = {}) {
  const { mint = defaultMintERC721, batchSize = 0n } = options;

  describe("approve", function () {
    it("should approve", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);

      const tx = contractInstance.approve(receiver, batchSize + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Approval")
        .withArgs(owner, receiver, batchSize + tokenId);

      const approved = await contractInstance.getApproved(batchSize + tokenId);
      expect(approved).to.equal(receiver);

      const tx1 = contractInstance.connect(receiver).burn(batchSize + tokenId);
      await expect(tx1)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner, ZeroAddress, batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(batchSize);
    });

    it("should approve to self", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.approve(owner, batchSize + tokenId);
      await expect(tx).to.not.be.reverted;
    });

    it("should fail: ERC721InvalidApprover", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, batchSize + tokenId);
      const tx = contractInstance.connect(receiver).approve(owner, batchSize + tokenId);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC721InvalidApprover").withArgs(receiver);
    });
  });
}
