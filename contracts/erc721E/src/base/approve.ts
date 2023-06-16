import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldApprove(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n, batchSize: defaultBatchSize = 0n } = options;

  describe("approve", function () {
    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      // ? suppose to be tokenId instead of 0
      const tx = contractInstance.connect(receiver).approve(owner.address, defaultTokenId);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should fail: approve to self", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const tx = contractInstance.approve(owner.address, defaultTokenId);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should approve", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const tx = contractInstance.approve(receiver.address, defaultTokenId);
      await expect(tx).to.emit(contractInstance, "Approval").withArgs(owner.address, receiver.address, defaultTokenId);

      const approved = await contractInstance.getApproved(defaultTokenId);
      expect(approved).to.equal(receiver.address);

      const tx1 = contractInstance.connect(receiver).burn(defaultTokenId);
      await expect(tx1).to.emit(contractInstance, "Transfer").withArgs(owner.address, ZeroAddress, defaultTokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(defaultBatchSize);
    });
  });
}
