import { expect } from "chai";

import { PAUSER_ROLE } from "../../../constants";

export function shouldPause() {
  describe("pause", function () {
    it("should fail: account is missing role", async function () {
      const tx = this.erc721Instance.connect(this.receiver).pause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );

      const tx2 = this.erc721Instance.connect(this.receiver).unpause();
      await expect(tx2).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should pause/unpause", async function () {
      const tx1 = this.erc721Instance.mint(this.owner.address, 0);
      await expect(tx1).to.not.be.reverted;

      const balanceOfOwner1 = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner1).to.equal(1);

      const tx2 = this.erc721Instance.pause();
      await expect(tx2).to.emit(this.erc721Instance, "Paused").withArgs(this.owner.address);

      const tx3 = this.erc721Instance.mint(this.owner.address, 1);
      await expect(tx3).to.be.revertedWith(`ERC721Pausable: token transfer while paused`);

      const tx4 = this.erc721Instance.unpause();
      await expect(tx4).to.emit(this.erc721Instance, "Unpaused").withArgs(this.owner.address);

      const tx5 = this.erc721Instance.mint(this.owner.address, 2);
      await expect(tx5).to.not.be.reverted;

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(2);
    });
  });
}
