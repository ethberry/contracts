import { expect } from "chai";
import { ethers } from "hardhat";
import { tokenId } from "../../../constants";

export function shouldBurn() {
  describe("burn", function () {
    it("should fail: not an owner", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);
      const tx = this.erc721Instance.connect(this.receiver).burn(tokenId);

      await expect(tx).to.be.revertedWith(`ERC721: caller is not token owner nor approved`);
    });

    it("should burn own token", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);
      const tx = await this.erc721Instance.burn(tokenId);

      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, tokenId);

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should burn approved token", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);
      await this.erc721Instance.approve(this.receiver.address, tokenId);

      const tx = await this.erc721Instance.burn(tokenId);

      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, tokenId);

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}
