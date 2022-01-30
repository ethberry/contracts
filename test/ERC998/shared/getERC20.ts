import { expect } from "chai";
import { amount } from "../../constants";

export function shouldGetERC20() {
  describe("getERC20", function () {
    it("should get erc20 tokens", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);
      await this.erc20Instance.approve(this.erc998Instance.address, amount);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);

      const tx1 = this.erc998Instance.getERC20(this.owner.address, 1, this.erc20Instance.address, amount);
      await expect(tx1)
        .to.emit(this.erc998Instance, "ReceivedERC20")
        .withArgs(this.owner.address, 1, this.erc20Instance.address, amount);
      await expect(tx1).to.emit(this.erc20Instance, "Transfer").withArgs(this.owner.address, this.erc998Instance.address, amount);
    });
  });
}