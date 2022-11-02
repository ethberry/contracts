import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, tokenId } from "../../constants";
import { deployErc1155Base } from "../fixtures";

export function shouldBurnBatch(name: string) {
  describe("burnBatch", function () {
    it("should fail: burn amount exceeds totalSupply", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      await contractInstance.mintBatch(owner.address, [tokenId], [amount], "0x");

      const tx = contractInstance.burnBatch(owner.address, [tokenId], [amount * 2]);
      await expect(tx).to.be.revertedWith("ERC1155: burn amount exceeds totalSupply");
    });
  });
}
