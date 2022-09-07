import { expect } from "chai";

import { amount } from "../../constants";

export function shouldTransfer() {
  describe("transfer", function () {
    it("should fail: transfer amount exceeds balance", async function () {
      const tx = this.contractInstance.transfer(this.receiver.address, amount);
      await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should transfer", async function () {
      await this.contractInstance.mint(this.owner.address, amount);

      const tx = this.contractInstance.transfer(this.receiver.address, amount);
      await expect(tx)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, this.receiver.address, amount);

      const receiverBalance = await this.contractInstance.balanceOf(this.receiver.address);
      expect(receiverBalance).to.equal(amount);

      const balanceOfOwner = await this.contractInstance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should transfer to contract", async function () {
      await this.contractInstance.mint(this.owner.address, amount);

      const tx = this.contractInstance.transfer(this.erc20NonReceiverInstance.address, amount);
      await expect(tx)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, this.erc20NonReceiverInstance.address, amount);

      const nonReceiverBalance = await this.contractInstance.balanceOf(this.erc20NonReceiverInstance.address);
      expect(nonReceiverBalance).to.equal(amount);

      const balanceOfOwner = await this.contractInstance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}
