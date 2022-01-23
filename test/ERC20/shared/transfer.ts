import { expect } from "chai";

import { amount } from "../../constants";

export function shouldTransfer() {
  describe("transfer", function () {
    it("should fail: transfer amount exceeds balance", async function () {
      const tx = this.erc20Instance.connect(this.receiver).transfer(this.owner.address, amount);
      await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should transfer", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      const tx = this.erc20Instance.transfer(this.receiver.address, amount);
      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(this.owner.address, this.receiver.address, amount);

      const receiverBalance = await this.erc20Instance.balanceOf(this.receiver.address);
      expect(receiverBalance).to.equal(amount);

      const balanceOfOwner = await this.erc20Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should transfer to contract", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      const tx = this.erc20Instance.transfer(this.coinNonReceiverInstance.address, amount);
      await expect(tx)
        .to.emit(this.erc20Instance, "Transfer")
        .withArgs(this.owner.address, this.coinNonReceiverInstance.address, amount);

      const nonReceiverBalance = await this.erc20Instance.balanceOf(this.coinNonReceiverInstance.address);
      expect(nonReceiverBalance).to.equal(amount);

      const balanceOfOwner = await this.erc20Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}
