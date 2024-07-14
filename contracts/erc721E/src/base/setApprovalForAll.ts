import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldSetApprovalForAll(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0n } = options;

  describe("setApprovalForAll", function () {
    it("should approve to EOA", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      const balanceOfOwner = await contractInstance.balanceOf(owner);
      expect(balanceOfOwner).to.equal(1);

      const tx1 = contractInstance.setApprovalForAll(receiver, true);
      await expect(tx1).to.not.be.reverted;

      const approved1 = await contractInstance.getApproved(defaultTokenId);
      expect(approved1).to.equal(ZeroAddress);

      const isApproved1 = await contractInstance.isApprovedForAll(owner, receiver);
      expect(isApproved1).to.equal(true);

      const tx2 = contractInstance.setApprovalForAll(receiver, false);
      await expect(tx2).to.not.be.reverted;

      const approved3 = await contractInstance.getApproved(defaultTokenId);
      expect(approved3).to.equal(ZeroAddress);

      const isApproved2 = await contractInstance.isApprovedForAll(owner, receiver);
      expect(isApproved2).to.equal(false);
    });

    it("should approve to self", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      const tx = contractInstance.setApprovalForAll(owner, true);
      await expect(tx).to.not.be.reverted;
    });

    it("should fail: ERC721InvalidOperator", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner);

      const tx = contractInstance.setApprovalForAll(ZeroAddress, true);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC721InvalidOperator").withArgs(ZeroAddress);
    });
  });
}
