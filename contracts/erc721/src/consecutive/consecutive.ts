import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

export function shouldBehaveLikeERC721Consecutive(
  factory: () => Promise<Contract>,
  options: Record<string, any> = {
    initialBalance: 0,
  },
) {
  describe("Consecutive", function () {
    it("ownerOf", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      for (const e of new Array(options.initialBalance).fill(null).map((_e, i) => i)) {
        const ownerOf = await contractInstance.ownerOf(e);
        expect(ownerOf).to.equal(owner.address);
      }
    });

    it("balanceOf", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const balance = await contractInstance.balanceOf(owner.address);
      expect(balance).to.equal(options.initialBalance);
    });
  });
}
