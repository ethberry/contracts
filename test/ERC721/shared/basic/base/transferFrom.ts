import { expect } from "chai";
import { ethers } from "hardhat";
import { tokenId } from "../../../../constants";

export function shouldTransferFrom() {
  describe("transferFrom", function () {
    it("should fail: not an owner", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);
      const tx = this.erc721Instance
        .connect(this.receiver)
        .transferFrom(this.owner.address, this.receiver.address, tokenId);

      await expect(tx).to.be.revertedWith(`ERC721: caller is not token owner nor approved`);
    });

    it("should fail: zero addr", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);
      const tx = this.erc721Instance.transferFrom(this.owner.address, ethers.constants.AddressZero, tokenId);

      await expect(tx).to.be.revertedWith(`ERC721: transfer to the zero address`);
    });

    it("should transfer own tokens to wallet", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);
      const tx = this.erc721Instance.transferFrom(this.owner.address, this.receiver.address, tokenId);

      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(this.owner.address, this.receiver.address, tokenId);

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await this.erc721Instance.balanceOf(this.receiver.address);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer approved tokens to wallet", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);
      await this.erc721Instance.approve(this.receiver.address, tokenId);

      const tx = this.erc721Instance
        .connect(this.receiver)
        .transferFrom(this.owner.address, this.receiver.address, tokenId);

      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(this.owner.address, this.receiver.address, tokenId);

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await this.erc721Instance.balanceOf(this.receiver.address);
      expect(balanceOfReceiver).to.equal(1);
    });
  });
}
