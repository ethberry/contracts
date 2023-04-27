import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { TMintERC1155Fn } from "../shared/interfaces/IMintERC1155Fn";
import { defaultMintERC1155 } from "../shared/defaultMintERC1155";

export function shouldBurn(factory: () => Promise<Contract>, mint: TMintERC1155Fn = defaultMintERC1155) {
  describe("burn", function () {
    it("should fail: burn amount exceeds totalSupply", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");

      const tx = contractInstance.burn(owner.address, tokenId, amount * 2);
      await expect(tx).to.be.revertedWith("ERC1155: burn amount exceeds totalSupply");
    });
  });
}
