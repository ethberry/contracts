import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, tokenId } from "@gemunion/contracts-test-constants";

import { deployErc1155Base } from "../fixtures";

export function shouldGetTotalSupply(name: string) {
  describe("totalSupply", function () {
    it("should get total supply (mint)", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      await contractInstance.mint(receiver.address, tokenId, amount, "0x");

      const totalSupply = await contractInstance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });

    it("should get total supply (mintBatch)", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      await contractInstance.mintBatch(receiver.address, [tokenId], [amount], "0x");

      const totalSupply = await contractInstance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });
  });
}
