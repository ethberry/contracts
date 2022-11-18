import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";

export function shouldBurnBatch(factory: () => Promise<Contract>) {
  describe("burnBatch", function () {
    it("should fail: burn amount exceeds totalSupply", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mintBatch(owner.address, [tokenId], [amount], "0x");

      const tx = contractInstance.burnBatch(owner.address, [tokenId], [amount * 2]);
      await expect(tx).to.be.revertedWith("ERC1155: burn amount exceeds totalSupply");
    });
  });
}
