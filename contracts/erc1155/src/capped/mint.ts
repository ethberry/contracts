import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { TMintERC1155Fn } from "../shared/interfaces/IMintERC1155Fn";
import { defaultMintERC1155 } from "../shared/defaultMintERC1155";

export function shouldMint(factory: () => Promise<Contract>, mint: TMintERC1155Fn = defaultMintERC1155) {
  describe("mint", function () {
    it("should fail: double mint", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, receiver.address, tokenId, amount, "0x");
      const tx1 = contractInstance.mint(receiver.address, tokenId, amount, "0x");
      await expect(tx1).to.be.revertedWith("ERC1155Capped: subsequent mint not allowed");
    });
  });
}
