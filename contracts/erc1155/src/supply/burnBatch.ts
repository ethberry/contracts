import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, tokenId } from "@gemunion/contracts-constants";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintBatchERC1155 } from "../shared/defaultMint";

export function shouldBurnBatch(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { mintBatch = defaultMintBatchERC1155 } = options;

  describe("burnBatch", function () {
    it("should fail: burn amount exceeds totalSupply", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mintBatch(contractInstance, owner, owner.address, [tokenId], [amount], "0x");

      const tx = contractInstance.burnBatch(owner.address, [tokenId], [amount * 2n]);
      await expect(tx).to.be.revertedWith("ERC1155: burn amount exceeds totalSupply");
    });
  });
}
