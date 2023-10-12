import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintERC1155 } from "../shared/defaultMint";

export function shouldSetApprovalForAll(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { mint = defaultMintERC1155 } = options;

  describe("setApprovalForAll", function () {
    it("should approve to EOA", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");

      const balanceOfOwner = await contractInstance.balanceOf(owner, tokenId);
      expect(balanceOfOwner).to.equal(amount);

      const tx1 = contractInstance.setApprovalForAll(receiver, true);
      await expect(tx1).to.not.be.reverted;

      const isApproved1 = await contractInstance.isApprovedForAll(owner, receiver);
      expect(isApproved1).to.equal(true);

      const tx2 = contractInstance.setApprovalForAll(receiver, false);
      await expect(tx2).to.not.be.reverted;

      const isApproved2 = await contractInstance.isApprovedForAll(owner, receiver);
      expect(isApproved2).to.equal(false);
    });

    it("should approve to self", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");

      const tx = contractInstance.setApprovalForAll(owner, true);
      await expect(tx).to.not.be.reverted;
    });

    it("should fail: ERC1155InvalidOperator", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");

      const tx = contractInstance.setApprovalForAll(ZeroAddress, true);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidOperator").withArgs(ZeroAddress);
    });
  });
}
