import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import type { IERC721Options } from "@gemunion/contracts-erc721";

export function shouldBehaveLikeERC721Consecutive(factory: () => Promise<Contract>, options: IERC721Options = {}) {
  describe("consecutive", function () {
    const { batchSize = 0 } = options;

    it("ownerOf", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      for (const e of new Array(batchSize).fill(null).map((_e, i) => i)) {
        const ownerOf = await contractInstance.ownerOf(e);
        expect(ownerOf).to.equal(owner.address);
      }
    });

    it("balanceOf", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const balance = await contractInstance.balanceOf(owner.address);
      expect(balance).to.equal(batchSize);
    });
  });
}
