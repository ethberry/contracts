import { expect } from "chai";

import { accessControlInterfaceId, amount, SNAPSHOT_ROLE } from "../../constants";

export function shouldSnapshot() {
  describe("snapshot", function () {
    it("should fail: account is missing role", async function () {
      const supportsAccessControl = await this.contractInstance.supportsInterface(accessControlInterfaceId);

      const tx = this.contractInstance.connect(this.receiver).snapshot();
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${SNAPSHOT_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should fail: nonexistent id", async function () {
      const tx = this.contractInstance.snapshot();
      await expect(tx).to.emit(this.contractInstance, "Snapshot").withArgs("1");

      const tx2 = this.contractInstance.balanceOfAt(this.receiver.address, "2");
      await expect(tx2).to.be.revertedWith("ERC20Snapshot: nonexistent id");
    });

    it("should make snapshot", async function () {
      await this.contractInstance.mint(this.owner.address, amount);

      const tx = this.contractInstance.snapshot();
      await expect(tx).to.emit(this.contractInstance, "Snapshot").withArgs("1");

      const balanceOfReceiver = await this.contractInstance.balanceOfAt(this.receiver.address, "1");
      expect(balanceOfReceiver).to.equal(0);

      const balanceOfOwner = await this.contractInstance.balanceOfAt(this.owner.address, "1");
      expect(balanceOfOwner).to.equal(amount);

      const totalSupply = await this.contractInstance.totalSupplyAt("1");
      expect(totalSupply).to.equal(amount);
    });
  });
}
