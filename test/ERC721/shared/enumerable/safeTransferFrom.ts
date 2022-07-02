import { expect } from "chai";

export function shouldSafeTransferFrom() {
  describe("safeTransferFrom", function () {
    it("should fail: not an owner", async function () {
      await this.erc721Instance.mint(this.owner.address);
      const tx = this.erc721Instance
        .connect(this.receiver)
        ["safeTransferFrom(address,address,uint256)"](this.owner.address, this.receiver.address, 0);

      await expect(tx).to.be.revertedWith(`ERC721: caller is not token owner nor approved`);
    });

    it("should transfer own tokens to receiver contract", async function () {
      await this.erc721Instance.mint(this.owner.address);
      const tx = this.erc721Instance["safeTransferFrom(address,address,uint256)"](
        this.owner.address,
        this.erc721ReceiverInstance.address,
        0,
      );

      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(this.owner.address, this.erc721ReceiverInstance.address, 0);

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await this.erc721Instance.balanceOf(this.erc721ReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer own tokens to non receiver contract", async function () {
      await this.erc721Instance.mint(this.owner.address);
      const tx = this.erc721Instance["safeTransferFrom(address,address,uint256)"](
        this.owner.address,
        this.erc721NonReceiverInstance.address,
        0,
      );
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      await this.erc721Instance.mint(this.owner.address);
      await this.erc721Instance.approve(this.receiver.address, 0);

      const tx = this.erc721Instance
        .connect(this.receiver)
        ["safeTransferFrom(address,address,uint256)"](this.owner.address, this.erc721ReceiverInstance.address, 0);

      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(this.owner.address, this.erc721ReceiverInstance.address, 0);

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await this.erc721Instance.balanceOf(this.erc721ReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer approved tokens to non receiver contract", async function () {
      await this.erc721Instance.mint(this.owner.address);
      await this.erc721Instance.approve(this.receiver.address, 0);

      const tx = this.erc721Instance
        .connect(this.receiver)
        ["safeTransferFrom(address,address,uint256)"](this.owner.address, this.erc721NonReceiverInstance.address, 0);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });
  });
}
