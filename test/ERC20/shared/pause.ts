import { expect } from "chai";

import { amount, PAUSER_ROLE } from "../../constants";

export function shouldERC20Pause() {
  describe("pause", function () {
    it("should fail: account is missing role", async function () {
      const tx = this.contractInstance.connect(this.receiver).pause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );

      const tx2 = this.contractInstance.connect(this.receiver).unpause();
      await expect(tx2).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should pause/unpause", async function () {
      await this.contractInstance.mint(this.owner.address, amount);

      const tx1 = this.contractInstance.pause();
      await expect(tx1).to.emit(this.contractInstance, "Paused").withArgs(this.owner.address);

      const tx2 = this.contractInstance.transfer(this.receiver.address, amount);
      await expect(tx2).to.be.revertedWith(`ERC20Pausable: token transfer while paused`);

      const tx4 = this.contractInstance.unpause();
      await expect(tx4).to.emit(this.contractInstance, "Unpaused").withArgs(this.owner.address);

      const tx5 = this.contractInstance.transfer(this.receiver.address, amount);
      await expect(tx5).to.not.be.reverted;

      const balanceOfOwner = await this.contractInstance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}
