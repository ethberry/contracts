import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import { amount, tokenId } from "../../constants";

export function shouldBalanceOfBatch() {
  describe("balanceOfBatch", function () {
    it("should fail for zero addr", async function () {
      const tx = this.erc1155Instance.balanceOfBatch([ethers.constants.AddressZero], [tokenId]);
      await expect(tx).to.be.revertedWith(`ERC1155: balance query for the zero address`);
    });

    it.skip("should get balance of owner", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      const balances = await this.erc1155Instance.balanceOfBatch(
        [this.owner.address, this.owner.address],
        [tokenId, 0],
      );
      expect(balances).to.deep.equal([BigNumber.from(amount), BigNumber.from(0)]);
    });
  });
}
