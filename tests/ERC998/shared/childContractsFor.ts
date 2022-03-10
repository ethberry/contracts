import { expect } from "chai";

export function shouldChildContractsFor() {
  describe("childContractsFor", function () {
    it("should get array of child contracts by index", async function () {
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

      const tx3 = this.erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        this.owner.address,
        this.erc721Instance.address,
        0, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx3).to.not.be.reverted;

      const tx4 = await this.erc721Instance.getChildCount(this.erc721Instance.address);
      expect(tx4).to.equal(1);

      const tx5 = await this.erc721Instance.childContractsFor(1);
      expect(tx5).deep.equal([this.erc721InstanceMock.address, this.erc721Instance.address]);
    });
  });
}
