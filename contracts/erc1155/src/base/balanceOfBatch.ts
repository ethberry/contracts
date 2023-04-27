import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, constants, Contract } from "ethers";

import { amount, tokenId } from "@gemunion/contracts-constants";
import { TMintERC1155Fn } from "../shared/interfaces/IMintERC1155Fn";
import { defaultMintERC1155 } from "../shared/defaultMintERC1155";

export function shouldBalanceOfBatch(factory: () => Promise<Contract>, mint: TMintERC1155Fn = defaultMintERC1155) {
  describe("balanceOfBatch", function () {
    it("should fail for zero addr", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.balanceOfBatch([constants.AddressZero], [tokenId]);
      await expect(tx).to.be.revertedWith(`ERC1155: address zero is not a valid owner`);
    });

    it("should get balance of owner", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, tokenId, amount, "0x");
      const balances = await contractInstance.balanceOfBatch([owner.address, owner.address], [tokenId, 0]);
      expect(balances).to.deep.equal([BigNumber.from(amount), BigNumber.from(0)]);
    });
  });
}
