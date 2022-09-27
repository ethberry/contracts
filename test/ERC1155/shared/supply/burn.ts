import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, tokenId } from "../../../constants";
import { deployErc1155Base } from "../fixtures";

export function shouldBurn(name: string) {
  describe("burn", function () {
    it("should fail: burn amount exceeds totalSupply", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      await contractInstance.mint(owner.address, tokenId, amount, "0x");

      const tx = contractInstance.burn(owner.address, tokenId, amount * 2);
      await expect(tx).to.be.revertedWith("ERC1155: burn amount exceeds totalSupply");
    });
  });
}
