import { expect } from "chai";
import { amount } from "../../constants";

export function shouldBalanceOfERC20() {
  describe("balanceOfERC20", function () {
    it("should get balance of erc20 tokens", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);
      await this.erc20Instance.approve(this.erc998Instance.address, amount);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);

      await this.erc998Instance.getERC20(this.owner.address, 1, this.erc20Instance.address, amount);

      const balance = await this.erc998Instance.balanceOfERC20(1, this.erc20Instance.address);
      expect(balance).to.equal(amount);
    });
  });
}