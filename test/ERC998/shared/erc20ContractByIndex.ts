import { expect } from "chai";
import { amount } from "../../constants";

export function shouldErc20ContractByIndex() {
  describe("erc20ContractByIndex", function () {
    it("should get erc20 contract by index", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);
      await this.erc20Instance.approve(this.erc998Instance.address, amount);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);

      await this.erc998Instance.getERC20(this.owner.address, 1, this.erc20Instance.address, amount);

      const address = await this.erc998Instance.erc20ContractByIndex(1, 0);
      expect(address).to.equal(this.erc20Instance.address);
    });
  });
}