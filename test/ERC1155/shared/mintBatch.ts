import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, MINTER_ROLE, tokenId } from "../../constants";

export function shouldMintBatch() {
  describe("mintBatch", function () {
    it("should fail for wrong role", async function () {
      const tx = this.erc1155Instance
        .connect(this.receiver)
        .mintBatch(this.receiver.address, [tokenId], [amount], "0x");
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint to wallet", async function () {
      const tx = this.erc1155Instance.mintBatch(this.receiver.address, [tokenId], [amount], "0x");
      await expect(tx)
        .to.emit(this.erc1155Instance, "TransferBatch")
        .withArgs(this.owner.address, ethers.constants.AddressZero, this.receiver.address, [tokenId], [amount]);

      const balance = await this.erc1155Instance.balanceOf(this.receiver.address, tokenId);
      expect(balance).to.equal(amount);

      const totalSupply = await this.erc1155Instance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });

    it("should fail to mint to non receiver", async function () {
      const tx = this.erc1155Instance.mintBatch(this.erc1155NonReceiverInstance.address, [tokenId], [amount], "0x");
      await expect(tx).to.be.revertedWith(`ERC1155: transfer to non ERC1155Receiver implementer`);
    });

    it("should mint to receiver", async function () {
      const tx = this.erc1155Instance.mintBatch(this.erc1155ReceiverInstance.address, [tokenId], [amount], "0x");
      await expect(tx)
        .to.emit(this.erc1155Instance, "TransferBatch")
        .withArgs(
          this.owner.address,
          ethers.constants.AddressZero,
          this.erc1155ReceiverInstance.address,
          [tokenId],
          [amount],
        );

      const balance = await this.erc1155Instance.balanceOf(this.erc1155ReceiverInstance.address, tokenId);
      expect(balance).to.equal(amount);
    });
  });
}
