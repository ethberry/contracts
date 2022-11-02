import { expect } from "chai";

import { amount } from "../../../../constants";

export function shouldTotalERC20Contracts() {
  describe("totalERC20Contracts", function () {
    it("should get total erc20 contracts", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);
      await this.erc20Instance.approve(this.erc721Instance.address, amount);
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      await this.erc721Instance.getERC20(this.owner.address, 1, this.erc20Instance.address, amount);

      const total = await this.erc721Instance.totalERC20Contracts(1);
      expect(total).to.equal(1);
    });
  });
}
