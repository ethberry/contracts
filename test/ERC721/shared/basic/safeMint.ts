import { expect } from "chai";
import { ethers } from "hardhat";

import { MINTER_ROLE, tokenId } from "../../../constants";

export function shouldSafeMint(roles = false) {
  describe("safeMint", function () {
    it("should fail: wrong role", async function () {
      const tx = this.erc721Instance.connect(this.receiver).safeMint(this.receiver.address, tokenId);
      await expect(tx).to.be.revertedWith(
        roles
          ? `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });

    it("should mint to wallet", async function () {
      const tx = this.erc721Instance.safeMint(this.owner.address, tokenId);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.owner.address, tokenId);

      const balance = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should fail to mint to non receiver", async function () {
      const tx = this.erc721Instance.safeMint(this.erc721NonReceiverInstance.address, tokenId);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should mint to receiver", async function () {
      const tx = this.erc721Instance.safeMint(this.erc721ReceiverInstance.address, tokenId);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.erc721ReceiverInstance.address, tokenId);

      const balance = await this.erc721Instance.balanceOf(this.erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });
  });
}
