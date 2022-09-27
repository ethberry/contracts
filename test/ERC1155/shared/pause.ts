import { expect } from "chai";

import { amount, PAUSER_ROLE, tokenId } from "../../constants";

export function shouldERC1155Pause() {
  describe("pause", function () {
    it("should fail: account is missing role", async function () {
      const tx = this.erc1155Instance.connect(this.receiver).pause();
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );

      const tx2 = this.erc1155Instance.connect(this.receiver).unpause();
      await expect(tx2).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${PAUSER_ROLE}`,
      );
    });

    it("should pause/unpause", async function () {
      const tx1 = this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      await expect(tx1).to.not.be.reverted;

      const balanceOfOwner1 = await this.erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balanceOfOwner1).to.equal(amount);

      const tx2 = this.erc1155Instance.pause();
      await expect(tx2).to.emit(this.erc1155Instance, "Paused").withArgs(this.owner.address);

      const tx3 = this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      await expect(tx3).to.be.revertedWith(`ERC1155Pausable: token transfer while paused`);

      const tx4 = this.erc1155Instance.unpause();
      await expect(tx4).to.emit(this.erc1155Instance, "Unpaused").withArgs(this.owner.address);

      const tx5 = this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      await expect(tx5).to.not.be.reverted;

      const balanceOfOwner = await this.erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balanceOfOwner).to.equal(2 * amount);
    });
  });
}
