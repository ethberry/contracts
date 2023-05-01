import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintERC1155 } from "../shared/defaultMint";

export function shouldBurn(factory: () => Promise<Contract>, options: IERC1155Options = {}) {
  const { mint = defaultMintERC1155 } = options;

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
