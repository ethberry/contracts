import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldBurn() {
  describe("burn", function () {
    it("should fail: not an owner", async function () {
      await this.erc721Instance.mint(this.owner.address, 0);
      const tx = this.erc721Instance.connect(this.receiver).burn(0);

      await expect(tx).to.be.revertedWith(`ERC721Burnable: caller is not owner nor approved`);
    });

    it("should burn own token", async function () {
      await this.erc721Instance.mint(this.owner.address, 0);
      const tx = await this.erc721Instance.burn(0);

      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, 0);

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should burn approved token", async function () {
      await this.erc721Instance.mint(this.owner.address, 0);
      await this.erc721Instance.approve(this.receiver.address, 0);

      const tx = await this.erc721Instance.burn(0);

      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, 0);

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}
