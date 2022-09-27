import { expect } from "chai";
import { ethers } from "hardhat";
import { amount, tokenId } from "../../../constants";

export function shouldBurn() {
  describe("burn", function () {
    it("should burn own token", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      const tx = this.erc1155Instance.burn(this.owner.address, tokenId, amount);

      await expect(tx)
        .to.emit(this.erc1155Instance, "TransferSingle")
        .withArgs(this.owner.address, this.owner.address, ethers.constants.AddressZero, tokenId, amount);

      const balanceOfOwner = await this.erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should burn approved token", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      await this.erc1155Instance.setApprovalForAll(this.receiver.address, true);

      const tx = this.erc1155Instance.connect(this.receiver).burn(this.owner.address, tokenId, amount);
      await expect(tx)
        .to.emit(this.erc1155Instance, "TransferSingle")
        .withArgs(this.receiver.address, this.owner.address, ethers.constants.AddressZero, tokenId, amount);

      const balanceOfOwner = await this.erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should fail: not an owner", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      const tx = this.erc1155Instance.connect(this.receiver).burn(this.owner.address, tokenId, amount);

      await expect(tx).to.be.revertedWith("ERC1155: caller is not token owner nor approved");
    });

    it("should fail: burn amount exceeds balance", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      await this.erc1155Instance.safeTransferFrom(this.owner.address, this.receiver.address, tokenId, amount, "0x");

      const tx = this.erc1155Instance.burn(this.owner.address, tokenId, amount);
      await expect(tx).to.be.revertedWith("ERC1155: burn amount exceeds balance");
    });
  });
}
