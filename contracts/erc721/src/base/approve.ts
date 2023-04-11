import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { tokenId } from "@gemunion/contracts-constants";

export function shouldApprove(factory: () => Promise<Contract>, options: Record<string, any> = {}) {
  describe("approve", function () {
    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, options.batchSize + tokenId);
      const tx = contractInstance.connect(receiver).approve(owner.address, options.batchSize + tokenId);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should fail: approve to self", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, options.batchSize + tokenId);
      const tx = contractInstance.approve(owner.address, options.batchSize + tokenId);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should approve", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, options.batchSize + tokenId);

      const tx = contractInstance.approve(receiver.address, options.batchSize + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Approval")
        .withArgs(owner.address, receiver.address, options.batchSize + tokenId);

      const approved = await contractInstance.getApproved(options.batchSize + tokenId);
      expect(approved).to.equal(receiver.address);

      const tx1 = contractInstance.connect(receiver).burn(options.batchSize + tokenId);
      await expect(tx1)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, constants.AddressZero, options.batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(options.batchSize);
    });
  });
}
