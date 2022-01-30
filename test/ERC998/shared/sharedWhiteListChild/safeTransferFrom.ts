import { expect } from "chai";

export function shouldSafeTransferFrom() {
  describe("safeTransferFrom", function () {
    it("should fail: not an owner", async function () {
      await this.erc998Instance.mint(this.owner.address);
      const tx = this.erc998Instance
        .connect(this.receiver)
        ["safeTransferFrom(address,address,uint256)"](this.owner.address, this.receiver.address, 0);

      await expect(tx).to.be.revertedWith(`ERC721: transfer caller is not owner nor approved`);
    });

    it("should fail: burned token", async function () {
      await this.erc721Instance.mint(this.owner.address);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);

      await this.erc721Instance.burn(0);

      const tx = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc998Instance.address,
        0,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx).to.be.revertedWith(`ERC721: operator query for nonexistent token`);
    });

    it("should fail: receiver is burned", async function () {
      await this.erc998Instance.whiteListChild(this.erc721Instance.address);
      await this.erc998Instance.setMaxChild(0);
      await this.erc721Instance.mint(this.owner.address);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);

      await this.erc998Instance.burn(1);

      const tx = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc998Instance.address,
        0,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx).to.be.revertedWith(`ERC721: owner query for nonexistent token`);
    });

    it("should transfer own tokens to receiver contract", async function () {
      await this.erc998Instance.mint(this.owner.address);
      const tx = this.erc998Instance["safeTransferFrom(address,address,uint256)"](
        this.owner.address,
        this.erc721ReceiverInstance.address,
        0,
      );

      await expect(tx).to.emit(this.erc998Instance, "Transfer").withArgs(this.owner.address, this.erc721ReceiverInstance.address, 0);

      const balanceOfOwner = await this.erc998Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await this.erc998Instance.balanceOf(this.erc721ReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await this.erc998Instance.tokenOfOwnerByIndex(this.erc721ReceiverInstance.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });

    it("should transfer own tokens to non receiver contract", async function () {
      await this.erc998Instance.mint(this.owner.address);
      const tx = this.erc998Instance["safeTransferFrom(address,address,uint256)"](
        this.owner.address,
        this.erc721NonReceiverInstance.address,
        0,
      );
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      await this.erc998Instance.mint(this.owner.address);
      await this.erc998Instance.approve(this.receiver.address, 0);

      const tx = this.erc998Instance
        .connect(this.receiver)
        ["safeTransferFrom(address,address,uint256)"](this.owner.address, this.erc721ReceiverInstance.address, 0);

      await expect(tx).to.emit(this.erc998Instance, "Transfer").withArgs(this.owner.address, this.erc721ReceiverInstance.address, 0);

      const balanceOfOwner = await this.erc998Instance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await this.erc998Instance.balanceOf(this.erc721ReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await this.erc998Instance.tokenOfOwnerByIndex(this.erc721ReceiverInstance.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });

    it("should transfer approved tokens to non receiver contract", async function () {
      await this.erc998Instance.mint(this.owner.address);
      await this.erc998Instance.approve(this.receiver.address, 0);

      const tx = this.erc998Instance
        .connect(this.receiver)
        ["safeTransferFrom(address,address,uint256)"](this.owner.address, this.erc721NonReceiverInstance.address, 0);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should transfer token to another token", async function () {
      await this.erc998Instance.whiteListChild(this.erc721Instance.address);
      await this.erc998Instance.setMaxChild(0);
      await this.erc721Instance.mint(this.owner.address);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);

      const tx1 = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc998Instance.address,
        0,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx1).to.emit(this.erc998Instance, "ReceivedChild").withArgs(this.owner.address, 1, this.erc721Instance.address, 0);
      await expect(tx1).to.emit(this.erc721Instance, "Transfer").withArgs(this.owner.address, this.erc998Instance.address, 0);

      const balanceOfOwner = await this.erc721Instance.balanceOf(this.erc998Instance.address);
      expect(balanceOfOwner).to.equal(1);

      // TODO "ComposableTopDown: _transferFrom token is child of other top down composable"
    });

    it("should not transfer token to itself", async function () {
      await this.erc998Instance.whiteListChild(this.erc998Instance.address);
      await this.erc998Instance.setMaxChild(0);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);

      const tx1 = this.erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc998Instance.address,
        1,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx1).to.be.revertedWith(`ComposableTopDown: circular ownership is forbidden`);
    });

    it("should transfer tree of tokens to wallet", async function () {
      await this.erc998Instance.whiteListChild(this.erc998Instance.address);
      await this.erc998Instance.setMaxChild(0);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);
      await this.erc998Instance.mint(this.owner.address);
      await this.erc998Instance.mint(this.owner.address);

      const tx1 = this.erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc998Instance.address,
        3,
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = this.erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc998Instance.address,
        2,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx2).to.not.be.reverted;

      const tx3 = this.erc998Instance["safeTransferFrom(address,address,uint256)"](this.owner.address, this.receiver.address, 1);
      await expect(tx3).to.not.be.reverted;

      const balance = await this.erc998Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(1);
    });

    it("should not transfer token from the middle of the tree", async function () {
      await this.erc998Instance.whiteListChild(this.erc998Instance.address);
      await this.erc998Instance.setMaxChild(0);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);
      await this.erc998Instance.mint(this.owner.address);
      await this.erc998Instance.mint(this.owner.address);

      const tx1 = this.erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc998Instance.address,
        3,
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = this.erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc998Instance.address,
        2,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx2).to.not.be.reverted;

      const tx3 = this.erc998Instance["safeTransferFrom(address,address,uint256)"](this.owner.address, this.receiver.address, 2);
      // DOUBLE CHECK
      await expect(tx3).to.be.revertedWith(`ERC721: transfer caller is not owner nor approved`);
    });

    it("should not transfer token to its child token", async function () {
      await this.erc998Instance.whiteListChild(this.erc998Instance.address);
      await this.erc998Instance.setMaxChild(0);
      await this.erc998Instance.mint(this.owner.address); // this is edge case
      await this.erc998Instance.mint(this.owner.address);
      await this.erc998Instance.mint(this.owner.address);

      const tx1 = this.erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc998Instance.address,
        1,
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = this.erc998Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc998Instance.address,
        2,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx2).to.be.revertedWith(`ComposableTopDown: circular ownership is forbidden`);
    });
  });
}