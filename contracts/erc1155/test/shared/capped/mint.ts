import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, tokenId } from "@gemunion/contracts-test-constants";

import { deployErc1155Base } from "../fixtures";

export function shouldMint(name: string) {
  describe("mint", function () {
    it("should fail: double mint", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      await contractInstance.mint(receiver.address, tokenId, amount, "0x");
      const tx1 = contractInstance.mint(receiver.address, tokenId, amount, "0x");
      await expect(tx1).to.be.revertedWith("ERC1155Capped: subsequent mint not allowed");
    });
  });
}
