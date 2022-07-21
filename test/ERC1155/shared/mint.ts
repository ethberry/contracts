import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, MINTER_ROLE, tokenId } from "../../constants";

export function shouldMint(roles = false) {
  describe("mint", function () {
    it("should mint to wallet", async function () {
      const tx1 = this.erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
      await expect(tx1)
        .to.emit(this.erc1155Instance, "TransferSingle")
        .withArgs(this.owner.address, ethers.constants.AddressZero, this.receiver.address, tokenId, amount);

      const balance = await this.erc1155Instance.balanceOf(this.receiver.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should mint to receiver", async function () {
      const tx1 = this.erc1155Instance.mint(this.erc1155ReceiverInstance.address, tokenId, amount, "0x");
      await expect(tx1)
        .to.emit(this.erc1155Instance, "TransferSingle")
        .withArgs(
          this.owner.address,
          ethers.constants.AddressZero,
          this.erc1155ReceiverInstance.address,
          tokenId,
          amount,
        );

      const balance = await this.erc1155Instance.balanceOf(this.erc1155ReceiverInstance.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("should fail: non receiver", async function () {
      const tx1 = this.erc1155Instance.mint(this.erc1155NonReceiverInstance.address, tokenId, amount, "0x");
      await expect(tx1).to.be.revertedWith(`ERC1155: transfer to non ERC1155Receiver implementer`);
    });

    it("should fail: wrong role", async function () {
      const tx1 = this.erc1155Instance.connect(this.receiver).mint(this.receiver.address, tokenId, amount, "0x");
      await expect(tx1).to.be.revertedWith(
        roles
          ? `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });
  });
}
