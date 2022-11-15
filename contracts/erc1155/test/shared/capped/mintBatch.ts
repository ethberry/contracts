import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";

export function shouldMintBatch(factory: () => Promise<Contract>) {
  describe("mintBatch", function () {
    it("should fail: double mint", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(receiver.address, tokenId, amount, "0x");
      const tx1 = contractInstance.mintBatch(receiver.address, [tokenId], [amount], "0x");
      await expect(tx1).to.be.revertedWith("ERC1155Capped: subsequent mint not allowed");
    });
  });
}
