import { expect } from "chai";

export function shouldTransferChild() {
  describe("transferChild", function () {
    it("should transfer token owned by another token to wallet", async function () {
      await this.erc721InstanceMock.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = this.erc721Instance.transferChild(1, this.receiver.address, this.erc721InstanceMock.address, 0);
      await expect(tx2)
        .to.emit(this.erc721Instance, "TransferChild")
        .withArgs(1, this.receiver.address, this.erc721InstanceMock.address, 0);
    });

    it("should transfer token owned by another token to the receiver contract", async function () {
      await this.erc721InstanceMock.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = this.erc721Instance.transferChild(1, this.erc721ReceiverInstance.address, this.erc721InstanceMock.address, 0);
      await expect(tx2)
        .to.emit(this.erc721Instance, "TransferChild")
        .withArgs(1, this.erc721ReceiverInstance.address, this.erc721InstanceMock.address, 0);
    });

    it("should transfer token owned by another token to the non receiver contract", async function () {
      await this.erc721InstanceMock.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = this.erc721Instance.transferChild(1, this.erc721NonReceiverInstance.address, this.erc721InstanceMock.address, 0);
      await expect(tx2)
        .to.emit(this.erc721Instance, "TransferChild")
        .withArgs(1, this.erc721NonReceiverInstance.address, this.erc721InstanceMock.address, 0);
    });

    it("should not transfer token which is not owned", async function () {
      await this.erc721InstanceMock.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      const tx = this.erc721Instance.transferChild(1, this.receiver.address, this.erc721InstanceMock.address, 0);

      await expect(tx).to.be.revertedWith(`ComposableTopDown: _transferChild _childContract _childTokenId not found`);
    });

    it("should transfer 998 token owned by another token to the wallet", async function () {
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        1, // erc998 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000002", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = this.erc721Instance.transferChild(2, this.receiver.address, this.erc721Instance.address, 1);
      await expect(tx2)
        .to.emit(this.erc721Instance, "TransferChild")
        .withArgs(2, this.receiver.address, this.erc721Instance.address, 1);
    });
  });
}