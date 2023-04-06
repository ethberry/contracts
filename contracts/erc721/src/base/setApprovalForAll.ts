import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { tokenId } from "@gemunion/contracts-constants";

export function shouldSetApprovalForAll(factory: () => Promise<Contract>, options: Record<string, any> = {}) {
  describe("setApprovalForAll", function () {
    it("should approve for all", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, options.batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(options.batchSize + 1);

      const tx1 = contractInstance.setApprovalForAll(receiver.address, true);
      await expect(tx1).to.not.be.reverted;

      const approved1 = await contractInstance.getApproved(options.batchSize + tokenId);
      expect(approved1).to.equal(constants.AddressZero);

      const isApproved1 = await contractInstance.isApprovedForAll(owner.address, receiver.address);
      expect(isApproved1).to.equal(true);

      const tx2 = contractInstance.setApprovalForAll(receiver.address, false);
      await expect(tx2).to.not.be.reverted;

      const approved3 = await contractInstance.getApproved(options.batchSize + tokenId);
      expect(approved3).to.equal(constants.AddressZero);

      const isApproved2 = await contractInstance.isApprovedForAll(owner.address, receiver.address);
      expect(isApproved2).to.equal(false);
    });
  });
}
