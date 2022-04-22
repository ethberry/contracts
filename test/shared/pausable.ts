import { expect } from "chai";

import { PAUSER_ROLE } from "../constants";

export function shouldPause(roles = false) {
  describe("pause", function () {
    it("should fail: not an owner", async function () {
      const tx = this.contractInstance.connect(this.receiver).pause();
      await expect(tx).to.be.revertedWith(
        roles
          ? `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`
          : "Ownable: caller is not the owner",
      );

      const tx2 = this.contractInstance.connect(this.receiver).unpause();
      await expect(tx2).to.be.revertedWith(
        roles
          ? `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should pause/unpause", async function () {
      const tx1 = this.contractInstance.pause();
      await expect(tx1).to.emit(this.contractInstance, "Paused").withArgs(this.owner.address);

      const tx2 = this.contractInstance.unpause();
      await expect(tx2).to.emit(this.contractInstance, "Unpaused").withArgs(this.owner.address);
    });
  });
}
