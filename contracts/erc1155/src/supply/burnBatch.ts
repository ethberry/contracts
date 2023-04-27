import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { TMintBatchERC1155Fn } from "../shared/interfaces/IMintERC1155Fn";
import { defaultMintBatchERC1155 } from "../shared/defaultMintERC1155";

export function shouldBurnBatch(
  factory: () => Promise<Contract>,
  mintBatch: TMintBatchERC1155Fn = defaultMintBatchERC1155,
) {
  describe("burnBatch", function () {
    it("should fail: burn amount exceeds totalSupply", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mintBatch(contractInstance, owner, owner.address, [tokenId], [amount], "0x");

      const tx = contractInstance.burnBatch(owner.address, [tokenId], [amount * 2]);
      await expect(tx).to.be.revertedWith("ERC1155: burn amount exceeds totalSupply");
    });
  });
}
