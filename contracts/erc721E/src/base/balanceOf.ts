import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { defaultMintERC721 } from "../shared/defaultMint";

export function shouldGetBalanceOf(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721 } = options;

  describe("balanceOf", function () {
    it("should fail for zero addr", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.balanceOf(ZeroAddress);
      await expect(tx).to.be.revertedWith(`ERC721: address zero is not a valid owner`);
    });

    it("should get balance of owner", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const balance = await contractInstance.balanceOf(owner.address);
      expect(balance).to.equal(1);
    });

    it("should get balance of not owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const balance = await contractInstance.balanceOf(receiver.address);
      expect(balance).to.equal(0);
    });
  });
}
