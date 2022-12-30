import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

export function shouldBehaveLikeERC721Capped(
  factory: () => Promise<Contract>,
  options: Record<string, any> = {
    initialBalance: 0,
  },
) {
  describe("cap", function () {
    it("should fail: cap exceeded", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(owner.address, options.initialBalance + 0);
      await contractInstance.mint(owner.address, options.initialBalance + 1);

      const cap = await contractInstance.cap();
      expect(cap).to.equal(options.initialBalance + 2);

      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply).to.equal(options.initialBalance + 2);

      const tx = contractInstance.mint(owner.address, options.initialBalance + 2);
      await expect(tx).to.be.revertedWith(`ERC721Capped: cap exceeded`);
    });
  });
}
