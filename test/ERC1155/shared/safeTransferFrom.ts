import { expect } from "chai";
import { amount, tokenId } from "../../constants";

export function shouldSafeTransferFrom() {
  describe("safeTransferFrom", function () {
    it("should fail: not an owner", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      const tx = this.erc1155Instance
        .connect(this.receiver)
        .safeTransferFrom(this.owner.address, this.receiver.address, tokenId, amount, "0x");
      await expect(tx).to.be.revertedWith(`ERC1155: caller is not token owner nor approved`);
    });

    it("should transfer own tokens to receiver contract", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      const tx = this.erc1155Instance.safeTransferFrom(
        this.owner.address,
        this.erc1155ReceiverInstance.address,
        tokenId,
        amount,
        "0x",
      );
      await expect(tx)
        .to.emit(this.erc1155Instance, "TransferSingle")
        .withArgs(this.owner.address, this.owner.address, this.erc1155ReceiverInstance.address, tokenId, amount);

      const balanceOfOwner = await this.erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await this.erc1155Instance.balanceOf(this.erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver).to.equal(amount);
    });

    it("should fail: transfer to non ERC1155Receiver implementer", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      const tx = this.erc1155Instance.safeTransferFrom(
        this.owner.address,
        this.erc1155NonReceiverInstance.address,
        tokenId,
        amount,
        "0x",
      );
      await expect(tx).to.be.revertedWith(`ERC1155: transfer to non ERC1155Receiver implementer`);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      await this.erc1155Instance.mint(this.owner.address, tokenId, amount, "0x");
      this.erc1155Instance.setApprovalForAll(this.receiver.address, true);

      const tx = this.erc1155Instance
        .connect(this.receiver)
        .safeTransferFrom(this.owner.address, this.erc1155ReceiverInstance.address, tokenId, amount, "0x");
      await expect(tx)
        .to.emit(this.erc1155Instance, "TransferSingle")
        .withArgs(this.receiver.address, this.owner.address, this.erc1155ReceiverInstance.address, tokenId, amount);

      const balanceOfOwner = await this.erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await this.erc1155Instance.balanceOf(this.erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver).to.equal(amount);
    });
  });
}
