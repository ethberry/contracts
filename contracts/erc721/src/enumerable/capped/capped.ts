import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

export function shouldCapped(factory: () => Promise<Contract>) {
  describe("cap", function () {
    it("should fail: cap exceeded", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address);
      await contractInstance.mint(owner.address);

      const cap = await contractInstance.cap();
      expect(cap).to.equal(2);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(2);

      const tx = contractInstance.mint(owner.address);
      await expect(tx).to.be.revertedWith(`ERC721CappedEnumerable: cap exceeded`);
    });
  });
}
