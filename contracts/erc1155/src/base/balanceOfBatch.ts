import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";

import type { IERC1155Options } from "../shared/defaultMint";
import { defaultMintERC1155 } from "../shared/defaultMint";

export function shouldBalanceOfBatch(factory: () => Promise<any>, options: IERC1155Options = {}) {
  const { mint = defaultMintERC1155 } = options;

  describe("balanceOfBatch", function () {
    it("should get balance of owner", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      const balances = await contractInstance.balanceOfBatch([owner, owner], [tokenId, 0]);
      expect(balances).to.deep.equal([amount, 0]);
    });

    it("should get balance of zero", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const balances1 = await contractInstance.balanceOfBatch([ZeroAddress], [tokenId]);
      expect(balances1).to.deep.equal([0]);

      await mint(contractInstance, owner, owner, tokenId, amount, "0x");
      await contractInstance.burn(owner, tokenId, amount);

      const balances2 = await contractInstance.balanceOfBatch([ZeroAddress], [tokenId]);
      expect(balances2).to.deep.equal([0]);
    });

    it("should fail: ERC1155InvalidArrayLength", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.balanceOfBatch([ZeroAddress, ZeroAddress], [tokenId]);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "ERC1155InvalidArrayLength").withArgs(1, 2);
    });
  });
}
