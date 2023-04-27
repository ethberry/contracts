import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { IMintERC1155Fns } from "../shared/interfaces/IMintERC1155Fn";

export function shouldMintBatch(factory: () => Promise<Contract>, mintFns: IMintERC1155Fns) {
  describe("mintBatch", function () {
    const { mint, mintBatch } = mintFns;
    it("should fail: double mint", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, receiver.address, tokenId, amount, "0x");

      const tx1 = mintBatch(contractInstance, owner, receiver.address, [tokenId], [amount], "0x");
      await expect(tx1).to.be.revertedWith("ERC1155Capped: subsequent mint not allowed");
    });
  });
}
