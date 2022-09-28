import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, tokenId } from "../../../constants";
import { deployErc1155Base } from "../fixtures";

export function shouldSetApprovalForAll(name: string) {
  describe("setApprovalForAll", function () {
    it("should approve for all", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      await contractInstance.mint(owner.address, tokenId, amount, "0x");

      const tx1 = contractInstance.setApprovalForAll(receiver.address, true);
      await expect(tx1).to.not.be.reverted;

      const isApproved1 = await contractInstance.isApprovedForAll(owner.address, receiver.address);
      expect(isApproved1).to.equal(true);

      const tx2 = contractInstance.setApprovalForAll(receiver.address, false);
      await expect(tx2).to.not.be.reverted;

      const isApproved2 = await contractInstance.isApprovedForAll(owner.address, receiver.address);
      expect(isApproved2).to.equal(false);
    });

    it("should fail setting approval status for self", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      await contractInstance.mint(owner.address, tokenId, amount, "0x");

      const tx = contractInstance.setApprovalForAll(owner.address, true);
      await expect(tx).to.be.revertedWith(`ERC1155: setting approval status for self`);
    });
  });
}
