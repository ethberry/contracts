import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

export function getGetCurrentTokenIndex(factory: () => Promise<Contract>) {
  describe("getCurrentTokenIndex", function () {
    it("should return current index after mint", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address);

      const index = await contractInstance.getCurrentTokenIndex();
      expect(index).to.equal(1);
      await contractInstance.mint(owner.address);

      const index2 = await contractInstance.getCurrentTokenIndex();
      expect(index2).to.equal(2);
    });
  });
}
