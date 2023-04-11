import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { royalty } from "@gemunion/contracts-constants";

export function shouldBurn(factory: () => Promise<Contract>) {
  describe("burn", function () {
    it("should reset token royalty info", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address); // 0
      await contractInstance.mint(owner.address); // 1

      await contractInstance.setTokenRoyalty(1, owner.address, royalty * 2);
      const [receiver, amount] = await contractInstance.royaltyInfo(1, 1e6);
      expect(receiver).to.equal(owner.address);
      expect(amount).to.equal(20000);

      const tx = await contractInstance.burn(1);
      await expect(tx).to.emit(contractInstance, "Transfer").withArgs(owner.address, constants.AddressZero, 1);

      const [receiver2, amount2] = await contractInstance.royaltyInfo(1, 1e6);
      expect(receiver2).to.equal(owner.address);
      expect(amount2).to.equal(10000);
    });
  });
}
