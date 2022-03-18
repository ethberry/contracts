import { expect } from "chai";
import { ethers } from "hardhat";

import { tokenId } from "../../../constants";

export function shouldApprove() {
  describe("approve", function () {
    it("should fail: not an owner", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);
      const tx = this.erc721Instance.connect(this.receiver).approve(this.owner.address, tokenId);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should fail: approve to self", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);
      const tx = this.erc721Instance.approve(this.owner.address, tokenId);
      await expect(tx).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("should approve", async function () {
      await this.erc721Instance.mint(this.owner.address, tokenId);

      const tx = this.erc721Instance.approve(this.receiver.address, tokenId);
      await expect(tx)
        .to.emit(this.erc721Instance, "Approval")
        .withArgs(this.owner.address, this.receiver.address, tokenId);

      const approved = await this.erc721Instance.getApproved(tokenId);
      expect(approved).to.equal(this.receiver.address);

      const tx1 = this.erc721Instance.connect(this.receiver).burn(tokenId);
      await expect(tx1)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, tokenId);

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}
