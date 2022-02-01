import { expect } from "chai";

export function shouldChildExists() {
  describe("childExists", function () {
    it("should check if child exists", async function () {
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

      const isExist1 = await this.erc721Instance.childExists(this.erc721InstanceMock.address, 0);
      expect(isExist1).to.equal(true);

      const isExist2 = await this.erc721Instance.childExists(this.erc721InstanceMock.address, 1);
      expect(isExist2).to.equal(false);
    });
  });
}