import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, constants } from "ethers";

import { amount, tokenId } from "../../constants";
import { deployErc1155Base } from "../fixtures";

export function shouldBalanceOfBatch(name: string) {
  describe("balanceOfBatch", function () {
    it("should fail for zero addr", async function () {
      const { contractInstance } = await deployErc1155Base(name);

      const tx = contractInstance.balanceOfBatch([constants.AddressZero], [tokenId]);
      await expect(tx).to.be.revertedWith(`ERC1155: address zero is not a valid owner`);
    });

    it("should get balance of owner", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      const balances = await contractInstance.balanceOfBatch([owner.address, owner.address], [tokenId, 0]);
      expect(balances).to.deep.equal([BigNumber.from(amount), BigNumber.from(0)]);
    });
  });
}
