import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function getGetCurrentTokenIndex(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721 } = options;

  describe("getCurrentTokenIndex", function () {
    it("should return current index after mint", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const index = await contractInstance.getCurrentTokenIndex();
      expect(index).to.equal(1);
      await mint(contractInstance, owner, owner.address);

      const index2 = await contractInstance.getCurrentTokenIndex();
      expect(index2).to.equal(2);
    });
  });
}
