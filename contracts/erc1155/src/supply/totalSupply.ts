import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";

export function shouldGetTotalSupply(factory: () => Promise<Contract>) {
  describe("totalSupply", function () {
    it("should get total supply (mint)", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(receiver.address, tokenId, amount, "0x");

      const totalSupply = await contractInstance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });

    it("should get total supply (mintBatch)", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mintBatch(receiver.address, [tokenId], [amount], "0x");

      const totalSupply = await contractInstance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });
  });
}
