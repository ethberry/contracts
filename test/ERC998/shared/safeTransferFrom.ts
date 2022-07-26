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

    it("should fail: burned token", async function () {
      await this.erc721InstanceMock.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      await this.erc721InstanceMock.burn(0);

      const tx = this.erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        0,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx).to.be.revertedWith(`ERC721: invalid token ID`);
    });

    it("should fail: receiver is burned", async function () {
      await this.erc721InstanceMock.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      await this.erc721Instance.burn(1);

      const tx = this.erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        0,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx).to.be.revertedWith(`ERC721: invalid token ID`);
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

      const item = await this.erc721Instance.tokenOfOwnerByIndex(this.erc721ReceiverInstance.address, 0);
      expect(item).to.equal(0); // 0 is nft index
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

      const item = await this.erc721Instance.tokenOfOwnerByIndex(this.erc721ReceiverInstance.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });

    it("should transfer approved tokens to non receiver contract", async function () {
      await this.erc721Instance.mint(this.owner.address);
      await this.erc721Instance.approve(this.receiver.address, 0);

      const tx = this.erc721Instance
        .connect(this.receiver)
        ["safeTransferFrom(address,address,uint256)"](this.owner.address, this.erc721NonReceiverInstance.address, 0);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should transfer token to another token", async function () {
      await this.erc721InstanceMock.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        0,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx1)
        .to.emit(this.erc721Instance, "ReceivedChild")
        .withArgs(this.owner.address, 1, this.erc721InstanceMock.address, 0);
      await expect(tx1)
        .to.emit(this.erc721InstanceMock, "Transfer")
        .withArgs(this.owner.address, this.erc721Instance.address, 0);

      const balanceOfOwner = await this.erc721InstanceMock.balanceOf(this.erc721Instance.address);
      expect(balanceOfOwner).to.equal(1);

      // TODO "CTD: _transferFrom token is child of other top down composable"
    });

    it("should not transfer token to itself", async function () {
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        1,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx1).to.be.revertedWith(`CTD: circular ownership is forbidden`);
    });

    it("should transfer tree of tokens to wallet", async function () {
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        3,
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        2,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx2).to.not.be.reverted;

      const tx3 = this.erc721Instance["safeTransferFrom(address,address,uint256)"](
        this.owner.address,
        this.receiver.address,
        1,
      );
      await expect(tx3).to.not.be.reverted;

      const balance = await this.erc721Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(1);
    });

    it("should not transfer token from the middle of the tree", async function () {
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        3,
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        2,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx2).to.not.be.reverted;

      const tx3 = this.erc721Instance["safeTransferFrom(address,address,uint256)"](
        this.owner.address,
        this.receiver.address,
        2,
      );
      // DOUBLE CHECK
      await expect(tx3).to.be.revertedWith(`ERC721: caller is not token owner nor approved`);
    });

    it("should not transfer token to its child token", async function () {
      await this.erc721Instance.mint(this.owner.address); // this is edge case
      await this.erc721Instance.mint(this.owner.address);
      await this.erc721Instance.mint(this.owner.address);

      const tx1 = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        1,
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        2,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx2).to.be.revertedWith(`CTD: circular ownership is forbidden`);
    });
  });
}
