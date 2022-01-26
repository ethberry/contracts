import { expect } from "chai";

import { amount, SNAPSHOT_ROLE } from "../../constants";

export function shouldSnapshot() {
  describe("snapshot", function () {
    it("should fail: must have snapshoter role", async function () {
      const tx = this.erc20Instance.connect(this.receiver).snapshot();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${SNAPSHOT_ROLE}`,
      );
    });

    it("should fail: nonexistent id", async function () {
      const tx = this.erc20Instance.snapshot();
      await expect(tx).to.emit(this.erc20Instance, "Snapshot").withArgs("1");

      const tx2 = this.erc20Instance.balanceOfAt(this.receiver.address, "2");
      await expect(tx2).to.be.revertedWith("ERC20Snapshot: nonexistent id");
    });

    it("should make snapshot", async function () {
      await this.erc20Instance.mint(this.owner.address, amount);

      const tx = this.erc20Instance.snapshot();
      await expect(tx).to.emit(this.erc20Instance, "Snapshot").withArgs("1");

      const balanceOfReceiver = await this.erc20Instance.balanceOfAt(this.receiver.address, "1");
      expect(balanceOfReceiver).to.equal(0);

      const balanceOfOwner = await this.erc20Instance.balanceOfAt(this.owner.address, "1");
      expect(balanceOfOwner).to.equal(amount);

      const totalSupply = await this.erc20Instance.totalSupplyAt("1");
      expect(totalSupply).to.equal(amount);
    });
  });
}
