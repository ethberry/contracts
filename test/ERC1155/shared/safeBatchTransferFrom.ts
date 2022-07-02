import { expect } from "chai";
import { amount, tokenId } from "../../constants";

export function shouldSafeBatchTransferFrom() {
  describe("safeBatchTransferFrom", function () {
    it("should transfer own tokens to receiver contract", async function () {
      const tokenId_1 = 2;
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      await this.erc1155Instance.mint(this.owner.address, tokenId_1, amount, "0x");
      const tx = this.erc1155Instance.safeBatchTransferFrom(
        this.owner.address,
        this.erc1155ReceiverInstance.address,
        [tokenId, tokenId_1],
        [amount, amount],
        "0x",
      );
      await expect(tx)
        .to.emit(this.erc1155Instance, "TransferBatch")
        .withArgs(
          this.owner.address,
          this.owner.address,
          this.erc1155ReceiverInstance.address,
          [tokenId, tokenId_1],
          [amount, amount],
        );

      const balanceOfOwner1 = await this.erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balanceOfOwner1).to.equal(0);
      const balanceOfOwner2 = await this.erc1155Instance.balanceOf(this.owner.address, tokenId_1);
      expect(balanceOfOwner2).to.equal(0);

      const balanceOfReceiver1 = await this.erc1155Instance.balanceOf(this.erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver1).to.equal(amount);
      const balanceOfReceiver2 = await this.erc1155Instance.balanceOf(this.erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver2).to.equal(amount);
    });

    it("should fail: transfer to non ERC1155Receiver implementer", async function () {
      const tokenId_1 = 2;
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      await this.erc1155Instance.mint(this.owner.address, tokenId_1, amount, "0x");
      const tx = this.erc1155Instance.safeBatchTransferFrom(
        this.owner.address,
        this.erc1155NonReceiverInstance.address,
        [tokenId, tokenId_1],
        [amount, amount],
        "0x",
      );
      await expect(tx).to.be.revertedWith(`ERC1155: transfer to non ERC1155Receiver implementer`);
    });

    it("should fail: not an owner", async function () {
      const tokenId_1 = 2;
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      await this.erc1155Instance.mint(this.owner.address, tokenId_1, amount, "0x");
      const tx = this.erc1155Instance
        .connect(this.receiver)
        .safeBatchTransferFrom(
          this.owner.address,
          this.erc1155ReceiverInstance.address,
          [tokenId, tokenId_1],
          [amount, amount],
          "0x",
        );
      await expect(tx).to.be.revertedWith(`ERC1155: caller is not token owner nor approved`);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const tokenId_1 = 2;
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      await this.erc1155Instance.mint(this.owner.address, tokenId_1, amount, "0x");
      this.erc1155Instance.setApprovalForAll(this.receiver.address, true);

      const tx = this.erc1155Instance
        .connect(this.receiver)
        .safeBatchTransferFrom(
          this.owner.address,
          this.erc1155ReceiverInstance.address,
          [tokenId, tokenId_1],
          [amount, amount],
          "0x",
        );
      await expect(tx)
        .to.emit(this.erc1155Instance, "TransferBatch")
        .withArgs(
          this.receiver.address,
          this.owner.address,
          this.erc1155ReceiverInstance.address,
          [tokenId, tokenId_1],
          [amount, amount],
        );

      const balanceOfOwner1 = await this.erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balanceOfOwner1).to.equal(0);
      const balanceOfOwner2 = await this.erc1155Instance.balanceOf(this.owner.address, tokenId_1);
      expect(balanceOfOwner2).to.equal(0);

      const balanceOfReceiver1 = await this.erc1155Instance.balanceOf(this.erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver1).to.equal(amount);
      const balanceOfReceiver2 = await this.erc1155Instance.balanceOf(this.erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver2).to.equal(amount);
    });
  });
}
