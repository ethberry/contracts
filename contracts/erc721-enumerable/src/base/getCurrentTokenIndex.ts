import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { TMintERC721EnumFn } from "../shared/interfaces/IMintERC721Fn";
import { defaultMintERC721Enum } from "../shared/defaultMintERC721";

export function getGetCurrentTokenIndex(
  factory: () => Promise<Contract>,
  mint: TMintERC721EnumFn = defaultMintERC721Enum,
) {
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
