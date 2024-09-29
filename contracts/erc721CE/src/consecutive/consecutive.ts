import { expect } from "chai";
import { ethers } from "hardhat";

import type { IERC721Options } from "@ethberry/contracts-erc721";

export function shouldBehaveLikeERC721Consecutive(factory: () => Promise<any>, options: IERC721Options = {}) {
  describe("consecutive", function () {
    const { batchSize = 0n } = options;

    it("ownerOf", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      for (const e of new Array(Number(batchSize)).fill(null).map((_e, i) => i)) {
        const ownerOf = await contractInstance.ownerOf(e);
        expect(ownerOf).to.equal(owner);
      }
    });

    it("balanceOf", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      const balance = await contractInstance.balanceOf(owner);
      expect(balance).to.equal(batchSize);
    });
  });
}
