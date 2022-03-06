import { expect } from "chai";
import { DEFAULT_ADMIN_ROLE } from "../../../constants";

export function shouldWhiteListChild() {
  describe("WhiteListChild", function () {
    it("should add to whiteListChild", async function () {
      await this.erc721Instance.whiteListChild(this.erc721InstanceMock.address);
      await this.erc721Instance.setMaxChild(0);
      const tx1 = await this.erc721Instance.isWhitelisted(this.erc721InstanceMock.address);
      expect(tx1).to.equal(true);
    });

    it("should fail: wrong role (whiteListChild)", async function () {
      const tx = this.erc721Instance.connect(this.receiver).whiteListChild(this.erc721InstanceMock.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should not in whiteListChild", async function () {
      const tx1 = await this.erc721Instance.isWhitelisted(this.erc721InstanceMock.address);
      expect(tx1).to.equal(false);
    });

    it("should ban in whiteListChild", async function () {
      await this.erc721Instance.whiteListChild(this.erc721InstanceMock.address);
      const tx1 = await this.erc721Instance.isWhitelisted(this.erc721InstanceMock.address);
      expect(tx1).to.equal(true);

      await this.erc721Instance.unWhitelistChild(this.erc721InstanceMock.address);
      const tx2 = await this.erc721Instance.isWhitelisted(this.erc721InstanceMock.address);
      expect(tx2).to.equal(false);
    });

    it("should fail: wrong role (unWhitelistChild)", async function () {
      await this.erc721Instance.whiteListChild(this.erc721InstanceMock.address);
      const tx1 = await this.erc721Instance.isWhitelisted(this.erc721InstanceMock.address);
      expect(tx1).to.equal(true);

      const tx = this.erc721Instance.connect(this.receiver).unWhitelistChild(this.erc721InstanceMock.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should match max", async function () {
      await this.erc721Instance.setMaxChild(10);
      const tx1 = await this.erc721Instance.getMaxChild();
      expect(tx1).to.equal(10);
    });

    it("should fail: wrong role (setMaxChild)", async function () {
      await this.erc721Instance.whiteListChild(this.erc721InstanceMock.address);
      const tx1 = await this.erc721Instance.isWhitelisted(this.erc721InstanceMock.address);
      expect(tx1).to.equal(true);

      const tx = this.erc721Instance.connect(this.receiver).setMaxChild(10);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should make increment for safeTransferFrom", async function () {
      await this.erc721Instance.whiteListChild(this.erc721InstanceMock.address);
      await this.erc721Instance.setMaxChild(0);
      await this.erc721InstanceMock.mint(this.owner.address);
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

      const tx2 = await this.erc721Instance.getChildCount(this.erc721InstanceMock.address);
      expect(tx2).to.equal(1);

      const tx3 = this.erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        1, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx3).to.not.be.reverted;

      const tx4 = await this.erc721Instance.getChildCount(this.erc721InstanceMock.address);
      expect(tx4).to.equal(2);
    });

    it("should make increment/decriment for safeTransferFrom", async function () {
      await this.erc721Instance.whiteListChild(this.erc721InstanceMock.address);
      await this.erc721Instance.setMaxChild(0);
      await this.erc721InstanceMock.mint(this.owner.address);
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

      const tx2 = await this.erc721Instance.getChildCount(this.erc721InstanceMock.address);
      expect(tx2).to.equal(1);

      const tx3 = this.erc721Instance["safeTransferChild(uint256,address,address,uint256)"](
        1,
        this.receiver.address,
        this.erc721InstanceMock.address,
        0,
      );
      await expect(tx3)
        .to.emit(this.erc721Instance, "TransferChild")
        .withArgs(1, this.receiver.address, this.erc721InstanceMock.address, 0);

      const tx4 = await this.erc721Instance.getChildCount(this.erc721InstanceMock.address);
      expect(tx4).to.equal(0);
    });

    it("should fail with excess number for safeTransferFrom", async function () {
      await this.erc721Instance.whiteListChild(this.erc721InstanceMock.address);
      await this.erc721Instance.setMaxChild(1);
      await this.erc721InstanceMock.mint(this.owner.address);
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

      const tx2 = await this.erc721Instance.getChildCount(this.erc721InstanceMock.address);
      expect(tx2).to.equal(1);

      const tx3 = this.erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        1, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx3).to.be.revertedWith(`WhiteListChild: excess number of address`);
    });

    it("should make increment/decriment for safeTransferFrom and safeTransferChild", async function () {
      await this.erc721Instance.whiteListChild(this.erc721InstanceMock.address);
      await this.erc721Instance.setMaxChild(0);
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

      const tx2 = await this.erc721Instance.getChildCount(this.erc721InstanceMock.address);
      expect(tx2).to.equal(1);

      const tx3 = this.erc721Instance["safeTransferChild(uint256,address,address,uint256)"](
        1,
        this.receiver.address,
        this.erc721InstanceMock.address,
        0,
      );
      await expect(tx3)
        .to.emit(this.erc721Instance, "TransferChild")
        .withArgs(1, this.receiver.address, this.erc721InstanceMock.address, 0);

      const tx4 = await this.erc721Instance.getChildCount(this.erc721InstanceMock.address);
      expect(tx4).to.equal(0);
    });

    it("should make increment/decriment for safeTransferFrom and transferChild", async function () {
      await this.erc721Instance.whiteListChild(this.erc721Instance.address);
      await this.erc721Instance.setMaxChild(0);
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

      const tx2 = await this.erc721Instance.getChildCount(this.erc721Instance.address);
      expect(tx2).to.equal(1);

      const tx3 = this.erc721Instance.transferChild(2, this.receiver.address, this.erc721Instance.address, 1);
      await expect(tx3)
        .to.emit(this.erc721Instance, "TransferChild")
        .withArgs(2, this.receiver.address, this.erc721Instance.address, 1);

      const tx4 = await this.erc721Instance.getChildCount(this.erc721Instance.address);
      expect(tx4).to.equal(0);
    });
  });
}
